import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface MathTaskProps {
  onComplete: () => void;
}

const MathTask = ({ onComplete }: MathTaskProps) => {
  const [answer, setAnswer] = useState('');
  const [problem, setProblem] = useState(generateMathProblem());

  const handleSubmit = () => {
    if (parseInt(answer) === problem.solution) {
      onComplete();
    } else {
      alert('Incorrect answer, try again!');
      setProblem(generateMathProblem()); // Generate a new problem
      setAnswer(''); // Clear the input
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.problemText}>{problem.question}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={answer}
        onChangeText={setAnswer}
        placeholder="Enter your answer"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${num1} + ${num2} = ?`,
    solution: num1 + num2,
  };
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  problemText: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: '80%',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default MathTask; 