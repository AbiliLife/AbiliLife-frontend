import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text
} from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeContext } from '@/contexts/ThemeContext';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function OTPInput({ 
  length = 6, 
  value, 
  onChange,
  error
}: OTPInputProps) {
  const { currentTheme } = React.useContext(ThemeContext);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = Array(length).fill(null);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return;

    const newValue = value.split('');
    newValue[index] = text.slice(-1);
    
    const newOtpValue = newValue.join('');
    onChange(newOtpValue);

    // Move to next input if current input is filled
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        {Array(length).fill(0).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => { inputRefs.current[index] = ref; }}
            style={[
              styles.input,
              focusedIndex === index && styles.inputFocused,
              currentTheme === 'light' ? { borderColor: Colors.secondary, color: Colors.primary } : { borderColor: Colors.white, color: Colors.lightGray },
              error && styles.inputError
            ]}
            value={value[index] || ''}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
            accessibilityLabel={`OTP digit ${index + 1} of ${length}`}
            accessibilityHint={`Enter digit ${index + 1} of your OTP`}
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 16,
  },
  input: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  inputFocused: {
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 8,
  },
});