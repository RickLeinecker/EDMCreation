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

import random
import math

_drum_notes = (36, 38, 49, 51, 46, 42, 50, 43, 47, 41, 56, 60, 62, 39, 72)

def drumvec2mid(drums, filename, n_beats, div_per_beat, bassline=None, key=36, bass_note_length=4):
    mid = mido.MidiFile(type=1)
    track = mido.MidiTrack()
    mid.tracks.append(track)

    track.append(mido.Message('program_change', program=12, time=0))
    for i in range(n_beats*div_per_beat):
        # Notes on
        for j in range(15):
            if drums[j, i] > 0.:
                track.append(mido.Message('note_on',
                                          channel=9,
                                          note=_drum_notes[j],
                                          velocity=min(math.ceil(drums[j, i]*8)*16, 127),
                                          time=0
                                          )
                            )
        # Notes off
        first_note_off = True
        for j in range(15):
            if drums[j, i] > 0.:
                track.append(mido.Message('note_off',
                                          channel=9,
                                          note=_drum_notes[j],
                                          velocity=64,
                                          time=first_note_off*(mid.ticks_per_beat//div_per_beat)
                                          )
                            )
                first_note_off = False
        if first_note_off:
            track.append(mido.Message('note_off',
                                      channel=9,
                                      velocity=64,
                                      time=(mid.ticks_per_beat//div_per_beat)
                                      )
                        )
    if bassline == "random":
        bassline = random.sample((0, 3, 5, 7, 10), 4)
    if bassline:
        track = mido.MidiTrack()
        mid.tracks.append(track)

        track.append(mido.Message('program_change', program=38, time=0))

        for note in bassline:
            track.append(mido.Message('note_on',
                                      channel=0,
                                      note=note+key,
                                      velocity=100,
                                      time=0
                                      )
                        )
            track.append(mido.Message('note_off',
                                      channel=0,
                                      note=note+key,
                                      velocity=64,
                                      time=mid.ticks_per_beat*bass_note_length
                                      )
                        )


    mid.save(filename)



def mid2drumvec(filename, n_beats, div_per_beat, loop=True):
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

n_beats = 16
div_per_beat = 24
timesteps = n_beats*div_per_beat
input_dim = 15


vae = tf.keras.models.load_model(f'{file_location}/deep_gru_vae')

def create_base(average=True):
    listdir = glob.glob(f'{file_location}/base/*.mid')
    bases = np.ndarray(shape=(len(listdir), timesteps, input_dim))
    for i, filename in enumerate(listdir):
        filename = os.path.basename(filename)
        bases[i] = mid2drumvec(f'{file_location}/base/{filename}', n_beats, div_per_beat).T

    latent_bases = vae.encoder.predict_on_batch(bases)[2]


    if average:
        return np.mean(latent_bases, axis=0)
    else:
        return latent_bases

def generate_mutations(latent_base, N=10, mutation_rate=0.5, method='mean', bassline=False, key=36, bass_note_length=4):
    if method == 'mean':
        for i in range(N):
            offset = (np.random.rand(*(latent_base.shape))*2) - 1
            offset /= np.linalg.norm(offset)
            offset *= mutation_rate
            latent_mutation = latent_base + offset
            latent_mutation = np.reshape(latent_mutation, newshape=(1, -1))

            mutation = vae.decoder(latent_mutation).numpy().T
            # mutation = vae(mutation).numpy().T
            drumvec2mid(mutation, f'{file_location}/output/{i}.mid', n_beats, div_per_beat)
    elif method == 'crossover':
        for i in range(N):
            latent = [np.random.choice(vec) for vec in latent_base.T]
            offset = (np.random.rand(*(np.shape(latent)))*2) - 1
            offset /= np.linalg.norm(offset)
            offset *= mutation_rate
            latent_mutation = latent + offset
            latent_mutation = np.reshape(latent_mutation, newshape=(1, -1))
            mutation = vae.decoder(latent_mutation).numpy().T
            # mutation = vae(mutation).numpy().T
            drumvec2mid(mutation, f'{file_location}/output/{i}.mid', n_beats, div_per_beat)
