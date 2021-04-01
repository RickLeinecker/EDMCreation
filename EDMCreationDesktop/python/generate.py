import numpy as np
import os
import mido
import glob


os.environ["TF_CPP_MIN_LOG_LEVEL"]="2"
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, activations
import keras.backend as K

import mido
import numpy as np
import os

def drumvec2mid(drums, filename, n_beats, div_per_beat):
    mid = mido.MidiFile()
    track = mido.MidiTrack()
    mid.tracks.append(track)

    track.append(mido.Message('program_change', program=12, time=0))
    for i in range(n_beats*div_per_beat):
        if drums[0,i] > 0.: # Bass / Kick
            track.append(mido.Message('note_on', channel=9, note=36, velocity=min(int(drums[0,i]*127), 127), time=0))
        if drums[1,i] > 0.: # Snare
            track.append(mido.Message('note_on', channel=9, note=38, velocity=min(int(drums[1,i]*127), 127), time=0))
        if drums[2,i] > 0.: # Crash Cymbal
            track.append(mido.Message('note_on', channel=9, note=49, velocity=min(int(drums[2,i]*127), 127), time=0))
        if drums[3,i] > 0.: # Ride Cymbal
            track.append(mido.Message('note_on', channel=9, note=51, velocity=min(int(drums[3,i]*127), 127), time=0))
        if drums[4,i] > 0.: # Open Hat
            track.append(mido.Message('note_on', channel=9, note=46, velocity=min(int(drums[4,i]*127), 127), time=0))
        if drums[5,i] > 0.: # Closed Hat
            track.append(mido.Message('note_on', channel=9, note=42, velocity=min(int(drums[5,i]*127), 127), time=0))
        if drums[6,i] > 0.: # High Tom
            track.append(mido.Message('note_on', channel=9, note=50, velocity=min(int(drums[6,i]*127), 127), time=0))
        if drums[7,i] > 0.: # High Floor Tom
            track.append(mido.Message('note_on', channel=9, note=43, velocity=min(int(drums[7,i]*127), 127), time=0))
        if drums[8,i] > 0.: # Low - Mid Tom
            track.append(mido.Message('note_on', channel=9, note=47, velocity=min(int(drums[8,i]*127), 127), time=0))
        if drums[9,i] > 0.: # Low Floor Tom
            track.append(mido.Message('note_on', channel=9, note=41, velocity=min(int(drums[9,i]*127), 127), time=0))
        if drums[10,i] > 0.: # Cowbell
            track.append(mido.Message('note_on', channel=9, note=56, velocity=min(int(drums[10,i]*127), 127), time=0))
        if drums[11,i] > 0.: # Hi Bongo
            track.append(mido.Message('note_on', channel=9, note=60, velocity=min(int(drums[11,i]*127), 127), time=0))
        if drums[12,i] > 0.: # Mute Hi conga
            track.append(mido.Message('note_on', channel=9, note=62, velocity=min(int(drums[12,i]*127), 127), time=0))
        if drums[13,i] > 0.: # Hand Clap
            track.append(mido.Message('note_on', channel=9, note=39, velocity=min(int(drums[13,i]*127), 127), time=0))
        if drums[14,i] > 0.: # Long Whistle
            track.append(mido.Message('note_on', channel=9, note=72, velocity=min(int(drums[14,i]*127), 127), time=0))
        track.append(mido.Message('note_off', channel=9, velocity=64, time=mid.ticks_per_beat//div_per_beat))

    mid.save(filename)

def mid2drumvec(filename, n_beats, div_per_beat, loop=False):
    mid = mido.MidiFile(filename)
    now = 0
    tempo = 500000
    drums = np.zeros((15, n_beats*div_per_beat))
    for msg in mid:
        now += msg.time
        tick = mido.second2tick(now, mid.ticks_per_beat, tempo)
        beat = tick/mid.ticks_per_beat
    # if beat < n_beats and loop is False:
    #     raise ValueError

    now = 0
    hit_count = 0
    for msg in mid:
        now += msg.time
        tick = mido.second2tick(now, mid.ticks_per_beat, tempo)
        beat = tick/mid.ticks_per_beat
        # print(tempo, now, tick, beat)
        # print(msg)
        if beat >= n_beats + (1/div_per_beat):
            # print('beat count', beat)
            break

        if msg.type =="set_tempo":
            tempo = msg.tempo
        elif msg.type == "note_on":#and msg.channel == 9:
            hit_count += 1
            try:
                if msg.note   in [35, 36]: # Bass / Kick
                    drums[0, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [38, 40, 37]: # Snare
                    drums[1, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [49, 55, 57, 52]: # Crash Cymbal
                    drums[2, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [51, 59, 53]: # Ride Cymbal
                    drums[3, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [46, 26]: # Open Hat
                    drums[4, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [42, 22, 44]: # Closed Hat
                    drums[5, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [50, 48, 66]: # High Tom
                    drums[6, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [43, 58]: # High Floor Tom
                    drums[7, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [47, 45]: # Low - Mid Tom
                    drums[8, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [41]: # Low Floor Tom
                    drums[9, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [56, 76, 77]: # Cowbell
                    drums[10, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [60]: # Hi Bongo
                    drums[11, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [62]: # Mute Hi conga
                    drums[12, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [39]: # Hand Clap
                    drums[13, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [71, 72, 78, 79]: # Whistle
                    drums[14, int(np.round(beat*div_per_beat - 1))] = msg.velocity/127
                elif msg.note in [33, 34]:
                    pass
                else:
                    print(filename + ' unknown drum ' + str(msg.note))
                    if msg.note < 35 or msg.note > 81:
                        raise ValueError

            except IndexError:
                break

    if loop is True:
        if beat < n_beats:
            beat_index = int(round(beat))*div_per_beat
            for n in range(n_beats//int(round(beat)) - 1):
                drums[:, (n+1)*beat_index:(n+2)*beat_index] = drums[:, 0:beat_index]
    return drums


file_location = os.path.dirname(os.path.abspath(__file__))

n_beats = 64
div_per_beat = 24
timesteps = n_beats*div_per_beat
input_dim = 15
latent_dim = 2

vae = tf.keras.models.load_model(f'{file_location}/lstm_vae')

def create_base():
    listdir = glob.glob(f'{file_location}/base/*.mid')
    bases = np.ndarray(shape=(len(listdir), timesteps, input_dim))
    for i, filename in enumerate(listdir):
        filename = os.path.basename(filename)
        bases[i] = mid2drumvec(f'{file_location}/base/{filename}', n_beats, div_per_beat).T

    latent_bases = np.zeros(shape=(len(listdir), 80))
    for i, latent_base in enumerate(vae.encoder.predict_on_batch(bases)):
        latent_bases[i] = latent_base[i]

    mean = np.mean(latent_bases, axis=0)
    return np.append(np.ndarray(shape=(0, 80)), [mean], axis=0)

def generate_mutations(latent_base, N=10, mutation_rate=.5):
    for i in range(N):
        offset = (np.random.rand(*(latent_base.shape))*2) - 1
        offset *= mutation_rate
        latent_mutation = latent_base + offset
        mutation = vae.decoder(latent_mutation).numpy()
        mutation = vae(mutation).numpy().T
        drumvec2mid(mutation, f'{file_location}/output/{i}.mid', n_beats, div_per_beat)
