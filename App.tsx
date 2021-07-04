import React from 'react';
import { useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import Svg, { Circle } from 'react-native-svg';

const BACKGROUND_COLOR= '#000000';
const BACKGROUND_STROKE_COLOR='#333333';
const STROKE_COLOR='#e3fc7b';
const STROKE_WIDTH = 30;
const STROKE_INNER_WIDTH = STROKE_WIDTH / 2

const {height, width} = Dimensions.get('window');

const cy = height / 2;
const cx = width / 2;

const CIRCLE_LENGTH = 1000; // 2PI * R
const R = CIRCLE_LENGTH / (2 * Math.PI);


const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function App() {
  const progress = useSharedValue(0);


  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value)
  }));

  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`
  })

  const progressButtonText = useDerivedValue(() => {
    return `${progress.value === 0 ? 'Empezar' : 'Volver'}`
  })

  const handlePress = useCallback(() => {
    progress.value = withTiming(progress.value > 0 ? 0 : 1, {duration: 2000}) 
  }, []) 


  return (
    <View style={styles.container}>
      <Svg>
        <Circle 
          cx={cx} 
          cy={cy} 
          r={R} 
          stroke={BACKGROUND_STROKE_COLOR} 
          strokeWidth={STROKE_WIDTH} 
        />
        <AnimatedCircle 
          cx={cx} 
          cy={cy} 
          r={R} 
          stroke={STROKE_COLOR} 
          strokeWidth={STROKE_INNER_WIDTH} 
          strokeDasharray={CIRCLE_LENGTH} 
          animatedProps={animatedProps}
          strokeLinecap='round'
        />
      </Svg>
      {/* NOT WORKING use ReText from React Native Redash */}
      {/* 
      <Animated.Text 
      style={styles.text}>
      {progressText.value}
      </Animated.Text> */}
      <ReText style={styles.text} text={progressText}/>
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={styles.button} 
        onPress={handlePress}
      >
        <ReText style={styles.btnText} text={progressButtonText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    zIndex: 10,
    color: STROKE_COLOR,
    fontSize: 80,
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -50 * 1.5}],
    width: '100%',
    textAlign: 'center'
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 80,
    width: width * 0.8,
    height: 60,
    borderRadius: 25,
    backgroundColor: BACKGROUND_STROKE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: STROKE_COLOR,
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 2
  }
});
