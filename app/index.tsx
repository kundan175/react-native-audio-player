import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
} from 'react-native';
import { Audio } from 'expo-av';
import WaveformAudio from './components/WaveformAudio';
import CircularPlay from './components/CircularPlay';
import VolumeModal from './components/VolumeModal';

// Types
interface AudioData {
  title: string;
  usersCount: string;
  duration: number;
  fileUrl: string;
}

// Constants
const audioData: AudioData = {
  title: "30 Mins Binaural Beats",
  usersCount: "10K men taken action",
  duration: 273.6,
  fileUrl: "https://mentoochallengeapp.blob.core.windows.net/app/assets/de8fcf9a-8ff0-4826-a8d2-14fbd6e4e90c.mp3"
};

export default function Home() {
  // State
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(audioData.duration);
  const [volume, setVolume] = useState(1.0);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  
  // Refs
  const positionRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effects
  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Audio handling
  const loadSound = async () => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioData.fileUrl },
        { shouldPlay: false, volume: volume },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sound:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      positionRef.current = status.positionMillis / 1000;

      if (status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      }

      if (status.didJustFinish) {
        setIsPlaying(false);
        sound?.setPositionAsync(0);
        setPosition(0);
      }
    }
  };

  // Player controls
  const togglePlayback = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = async () => {
    if (!sound) return;
    await sound.setPositionAsync(0);
    setPosition(0);
    if (!isPlaying) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const skipForward = async () => {
    if (!sound) return;
    const newPosition = Math.min(positionRef.current + 10, duration);
    await sound.setPositionAsync(newPosition * 1000);
    setPosition(newPosition);
  };

  const skipBackward = async () => {
    if (!sound) return;
    const newPosition = Math.max(positionRef.current - 10, 0);
    await sound.setPositionAsync(newPosition * 1000);
    setPosition(newPosition);
  };

  // Volume control
  const toggleVolumeModal = () => {
    setShowVolumeModal(!showVolumeModal);
  };

  const adjustVolume = async (value: number) => {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  // Render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.playerCard}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{audioData.title}</Text>
          <View style={styles.usersCountContainer}>
            <Image source={require("@/assets/images/Icon/persons.png")} />
            <Text style={styles.usersCount}>{audioData.usersCount}</Text>
          </View>
        </View>

        <View style={styles.waveformContainer}>
          <WaveformAudio isPlaying={isPlaying} />
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={skipBackward} style={styles.skipButton}>
            <Image source={require("@/assets/images/Icon/previous10Icon.png")} />
          </TouchableOpacity>

          <Text style={styles.timeDisplay}>
            {formatTime(isPlaying ? duration - position : duration)}
          </Text>

          <TouchableOpacity onPress={skipForward} style={styles.skipButton}>
            <Image source={require("@/assets/images/Icon/next10Icon.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.playButtonContainer}>
          <TouchableOpacity style={styles.bottomButton} onPress={resetAudio}>
            <Image source={require("@/assets/images/Icon/replay.png")} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={togglePlayback}
            disabled={isLoading}
          >
            <CircularPlay 
              value={position} 
              isPlaying={isPlaying} 
              isLoading={isLoading} 
              duration={duration}
            /> 
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomButton} onPress={toggleVolumeModal}>
            <Image source={require("@/assets/images/Icon/soundIcon.png")} />
          </TouchableOpacity>
        </View>

        <VolumeModal
          visible={showVolumeModal}
          volume={volume}
          onClose={toggleVolumeModal}
          onVolumeChange={adjustVolume}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  playerCard: {
    backgroundColor: '#1E1E1E',
    flex: 1,
    padding: 40,
    margin: 20,
    marginVertical: 40,
    borderRadius: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  usersCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  usersCount: {
    fontSize: 14,
    color: '#888',
    fontWeight: "400",
    fontFamily: 'Inter-Regular',
  },
  waveformContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 5,
  },
  timeDisplay: {
    fontSize: 32,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Inter-Medium',
  },
  skipButton: {
    alignItems: 'center',
  },
  playButtonContainer: {
    alignItems: 'center',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 35,
  },
  bottomButton: {
    padding: 10,
  },
});