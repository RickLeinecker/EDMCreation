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
_drum_names = ['Kick',
               'Snare',
               'Crash Cymbal',
               'Ride Cymbal',
               'Open Hat',
               'Closed Hat',
               'High Tom',
               'High Floor Tom',
               'Low-Mid Tom',
               'Low Floor Tom',
               'Cowbell',
               'Hi Bongo',
               'Mute Hi Conga',
               'Hand Clap',
               'Whistle']

def drumvec2mid(drums, filename, n_beats, div_per_beat, bassline=False, key=24, bass_note_length=4):
    mid = mido.MidiFile(type=1)
    tracks = []
    for i in range(15):
        track = mido.MidiTrack()
        track.name = _drum_names[i]
        mid.tracks.append(track)
        tracks.append(track)

    for i in range(n_beats*div_per_beat):
        # Notes on
        for j in range(15):
            if drums[j, i] > 0.:
                tracks[j].append(mido.Message('note_on',
                                          channel=9,
                                          note=_drum_notes[j],
                                          velocity=min(math.ceil(drums[j, i]*8)*16, 127),
                                          time=0
                                          )
                            )
                tracks[j].append(mido.Message('note_off',
                                          channel=9,
                                          note=_drum_notes[j],
                                          velocity=64,
                                          time=(mid.ticks_per_beat//div_per_beat)
                                          )
                            )
            else:
                tracks[j].append(mido.Message('note_off',
                                          channel=9,
                                          velocity=64,
                                          time=(mid.ticks_per_beat//div_per_beat)
                                          )
                            )
    if bassline:
        bassline = random.choices((0, 2, 4, 7, 9), k=n_beats//bass_note_length)
        track = mido.MidiTrack()
        track.name = "Bass"
        mid.tracks.append(track)

        track.append(mido.Message('program_change', program=38, time=0))

        for note in bassline:
            track.append(mido.Message('note_on',
                                      channel=0,
                                      note=note+key,
                                      velocity=80,
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

def create_base():
    listdir = glob.glob(f'{file_location}/base/*.mid')
    bases = np.ndarray(shape=(len(listdir), timesteps, input_dim))
    for i, filename in enumerate(listdir):
        filename = os.path.basename(filename)
        bases[i] = mid2drumvec(f'{file_location}/base/{filename}', n_beats, div_per_beat).T

    latent_bases = vae.encoder.predict_on_batch(bases)[2]

    return latent_bases

def generate_mutations(latent_bases, N=10, mutation_rate=0.5, method=0, bassline=False, key=36, bass_note_length=4):
    if method == 0: # Average method
        latent_base = np.mean(latent_bases, axis=0)
        for i in range(N):
            offset = (np.random.rand(*(latent_base.shape))*2) - 1
            offset /= np.linalg.norm(offset)
            offset *= mutation_rate
            latent_mutation = latent_base + offset
            latent_mutation = np.reshape(latent_mutation, newshape=(1, -1))
            mutation = vae.decoder(latent_mutation).numpy().T
            # mutation = vae(mutation).numpy().T
            drumvec2mid(mutation, f'{file_location}/output/{i}.mid', n_beats, div_per_beat, bassline, key, bass_note_length)
    elif method == 1: #  Crossover method
        for i in range(N):
            latent = [np.random.choice(vec) for vec in latent_bases.T]
            offset = (np.random.rand(*(np.shape(latent)))*2) - 1
            offset /= np.linalg.norm(offset)
            offset *= mutation_rate
            latent_mutation = latent + offset
            latent_mutation = np.reshape(latent_mutation, newshape=(1, -1))
            mutation = vae.decoder(latent_mutation).numpy().T
            # mutation = vae(mutation).numpy().T
            drumvec2mid(mutation, f'{file_location}/output/{i}.mid', n_beats, div_per_beat, bassline, key, bass_note_length)
