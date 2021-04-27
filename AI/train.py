import numpy as np
import os
import mido

os.environ["TF_CPP_MIN_LOG_LEVEL"]="2"
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, activations
import keras.backend as K


from drumvec import mid2drumvec, drumvec2mid, shift_range

n_beats = 16
div_per_beat = 24
timesteps = n_beats*div_per_beat
input_dim = 15
compressed_dim = 1
latent_dim = 128
EPOCHS = 300

class CustomCallback(keras.callbacks.Callback):
    def on_epoch_begin(self, epoch, logs=None):
        pass
        # print(self.model.loss_ratio)
        # self.model.loss_ratio.assign(.95 if (epoch/EPOCHS) < .5 else .85 )

class Sampling(layers.Layer):
    """Uses (z_mean, z_log_var) to sample z, the vector encoding a digit."""

    def call(self, inputs):
        z_mean, z_log_var = inputs
        batch = tf.shape(z_mean)[0]
        dim = tf.shape(z_mean)[1]
        epsilon = keras.backend.random_normal(shape=(batch, dim), mean=0., stddev=1.)
        return z_mean + tf.exp(0.5 * z_log_var) * epsilon


class VAE(keras.Model):
    def __init__(self, encoder, decoder, **kwargs):
        super(VAE, self).__init__(**kwargs)
        self.encoder = encoder
        self.decoder = decoder
        self.total_loss_tracker = keras.metrics.Mean(name="total_loss")
        self.reconstruction_loss_tracker = keras.metrics.Mean(
            name="reconstruction_loss"
        )
        self.kl_loss_tracker = keras.metrics.Mean(name="kl_loss")
        self.loss_ratio = tf.Variable(.95, trainable=False, dtype=tf.float32)

    def call(self, input):
        z_mean, z_log_var, z = self.encoder(input)
        return self.decoder(z)

    @property
    def metrics(self):
        return [
            self.total_loss_tracker,
            self.reconstruction_loss_tracker,
            self.kl_loss_tracker,
        ]

    def build_graph(self):
        x = keras.Input(shape=(timesteps, input_dim))
        return keras.Model(inputs=[x], outputs=self.call(x))

    def train_step(self, data):
        with tf.GradientTape() as tape:
            z_mean, z_log_var, z = self.encoder(data)
            reconstruction = self.decoder(z)
            mse = keras.losses.MeanSquaredError(reduction="sum")

            reconstruction_loss = mse(data, reconstruction)
            kl_loss = -0.5 * (1 + z_log_var - tf.square(z_mean) - tf.exp(z_log_var))
            kl_loss = tf.reduce_mean(tf.reduce_sum(kl_loss, axis=1))
            total_loss = (self.loss_ratio*reconstruction_loss) + ((1-self.loss_ratio)*kl_loss)
        grads = tape.gradient(total_loss, self.trainable_weights)
        self.optimizer.apply_gradients(zip(grads, self.trainable_weights))
        self.total_loss_tracker.update_state(total_loss)
        self.reconstruction_loss_tracker.update_state(reconstruction_loss)
        self.kl_loss_tracker.update_state(kl_loss)
        return {
            "loss_ratio": self.loss_ratio,
            "loss": self.total_loss_tracker.result(),
            "reconstruction_loss": self.reconstruction_loss_tracker.result(),
            "kl_loss": self.kl_loss_tracker.result(),
        }

encoder_inputs = keras.Input(shape=(timesteps, input_dim))

x = layers.GRU(input_dim, return_sequences=True)(encoder_inputs)
x = layers.GRU(input_dim, return_sequences=True)(x)
x = layers.GRU(input_dim, return_sequences=True)(x)
x = layers.GRU(10, return_sequences=True)(x)
x = layers.GRU(1, return_sequences=True)(x)
# x = layers.Reshape((4*div_per_beat, n_beats//4))(x)
# x = layers.LSTM(1, return_sequences=True)(x)
x = layers.Flatten()(x)
z_mean = layers.Dense(latent_dim, name="z_mean")(x)
z_log_var = layers.Dense(latent_dim, name="z_log_var")(x)
z = Sampling()([z_mean, z_log_var])
encoder = keras.Model(encoder_inputs, [z_mean, z_log_var, z], name="encoder")
encoder.summary()

decoder_inputs = keras.Input(shape=encoder.output[2].shape[1:])

# x = layers.Dense(4*div_per_beat)(decoder_inputs)
# x = layers.Reshape((4*div_per_beat, 1))(x)
# x = layers.LSTM(n_beats//4, return_sequences=True)(x)
x = layers.Dense(timesteps)(decoder_inputs)
x = layers.Reshape((timesteps, 1))(x)
x = layers.GRU(10, return_sequences=True)(x)

x = layers.GRU(input_dim, return_sequences=True)(x)
x = layers.GRU(input_dim, return_sequences=True)(x)
x = layers.GRU(input_dim, return_sequences=True)(x)

x = layers.GRU(input_dim, return_sequences=True)(x)
decoder_outputs = layers.ReLU(max_value=1.)(x)

decoder = keras.Model(inputs=decoder_inputs, outputs=decoder_outputs, name="decoder")

decoder.summary()



files = os.listdir('./prepared data/edm/')
edm = np.ndarray(shape=(len(files), timesteps, input_dim))
for i, filename in enumerate(files):
        drumvector = mid2drumvec('prepared data/edm/' + filename, n_beats, div_per_beat)
        edm[i] = drumvector.transpose()

files = os.listdir('./prepared data/groove/')
groove = np.ndarray(shape=(len(files), timesteps, input_dim))
for i, filename in enumerate(files):
        drumvector = mid2drumvec('prepared data/groove/' + filename, n_beats, div_per_beat)
        groove[i] = drumvector.transpose()

files = os.listdir('./prepared data/toontrack/')
toontrack = np.ndarray(shape=(len(files), timesteps, input_dim))
for i, filename in enumerate(files):
        drumvector = mid2drumvec('prepared data/toontrack/' + filename, n_beats, div_per_beat)
        toontrack[i] = drumvector.transpose()

x_train = np.concatenate((edm, groove, toontrack), axis=0);
# x_train = groove

x_valid = np.ndarray(shape=(len(os.listdir('./validate/')), timesteps, input_dim))
for i, filename in enumerate(os.listdir('./validate/')):
        drumvec = mid2drumvec('validate/' + filename, n_beats, div_per_beat)
        x_valid[i] = drumvec.transpose()


vae = VAE(encoder, decoder)
vae.compile(optimizer=keras.optimizers.Adam(learning_rate=0.01))

keras.utils.plot_model(vae.build_graph(), to_file="model.png", show_shapes=True, expand_nested=True)

vae.fit(x_train, epochs=EPOCHS, batch_size=64, callbacks=[CustomCallback(), keras.callbacks.ReduceLROnPlateau(monitor="reconstruction_loss", patience=5)], shuffle=True)

vae.evaluate(x_valid)

vae.save('deep_gru_vae')
# encoder.save('encoder')
# decoder.save('decoder')

# encoder = keras.models.load_model('encoder')

for i, a in enumerate(vae.predict_on_batch(edm)):
    a = a.T
    # print(f"max: {np.max(a)}, min: {np.min(a)}")
    filename = os.listdir('./prepared data/edm/')[i]
    drumvec2mid(a, f'nnout/edm/{filename}', n_beats, div_per_beat)

for i, a in enumerate(vae.predict_on_batch(groove)):
    a = a.T
    filename = os.listdir('./prepared data/groove/')[i]
    drumvec2mid(a, f'nnout/groove/{filename}', n_beats, div_per_beat)

latent_predictions = encoder.predict_on_batch(x_train)


import matplotlib.pyplot as plt

def draw_histograms(data, n_rows, n_cols):
    f, ax = plt.subplots(n_rows, n_cols)
    for i, entry in enumerate(data):
        x = i % n_cols
        y = i // n_cols
        ax[y, x].hist(entry)
    plt.show()

draw_histograms(latent_predictions[2].T, latent_dim//16, 16)
