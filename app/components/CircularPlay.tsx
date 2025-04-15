import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Constants
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.2;
const CIRCLE_THICKNESS = 4;
const DOT_SIZE = 4;
const SVG_PADDING = DOT_SIZE;
const SVG_SIZE = CIRCLE_SIZE + SVG_PADDING * 2;

// Calculate circle properties
const radius = (CIRCLE_SIZE - CIRCLE_THICKNESS) / 2;
const circumference = radius * 2 * Math.PI;

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularPlayProps {
  value?: number;
  maxValue?: number;
  minValue?: number;
  isPlaying?: boolean;
  isLoading?: boolean;
  duration?: number;
}

export default function CircularPlay({
  value = 0,
  isPlaying = false,
  isLoading = false,
  duration = 0,
}: CircularPlayProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef(null);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const colorInterpolation = animatedValue.interpolate({
    inputRange: [0, duration],
    outputRange: ["white", 'white'],
  });

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, duration],
    outputRange: [circumference, 0],
  });

  const renderPlayPauseButton = () => {
    if (isLoading) {
      return <ActivityIndicator color="white" size="large" />;
    }
    
    return (
      <Ionicons
        name={isPlaying ? "pause" : "play"}
        size={36}
        color="white"
        style={isPlaying ? {} : { marginLeft: 4 }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.playPauseButtonContainer}>
        {renderPlayPauseButton()}
      </View>
      <Svg width={SVG_SIZE} height={SVG_SIZE} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={4}
          fill="transparent"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          ref={circleRef}
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={radius}
          stroke={colorInterpolation}
          strokeWidth={CIRCLE_THICKNESS}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SVG_SIZE / 2} ${SVG_SIZE / 2})`}
        />

        {/* White Dot using strokeDashoffset */}
        <AnimatedCircle
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={radius}
          stroke="white"
          strokeWidth={DOT_SIZE}
          fill="transparent"
          strokeDasharray={`1 ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SVG_SIZE / 2} ${SVG_SIZE / 2})`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SVG_SIZE,
    height: SVG_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotateZ: '0deg' }],
    zIndex: 2,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1C',
    width: CIRCLE_SIZE - CIRCLE_THICKNESS * 2,
    height: CIRCLE_SIZE - CIRCLE_THICKNESS * 2,
    borderRadius: (CIRCLE_SIZE - CIRCLE_THICKNESS * 2) / 2,
    zIndex: 1,
  },
  playPauseButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
