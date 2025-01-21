import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Vibration,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState("25");
  const [restDuration, setRestDuration] = useState("5");
  const [rounds, setRounds] = useState("4");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRestPeriod, setIsRestPeriod] = useState(false);

  // Theme colors
  const colors = {
    work: {
      primary: "#22c55e",
      background: "#dcfce7",
      text: "#166534",
    },
    rest: {
      primary: "#3b82f6",
      background: "#dbeafe",
      text: "#1e40af",
    },
  };

  const currentTheme = isRestPeriod ? colors.rest : colors.work;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      Vibration.vibrate(Platform.OS === "ios" ? [0, 500] : [0, 500, 110, 500]);

      if (isRestPeriod) {
        // End of rest period
        if (currentRound < parseInt(rounds)) {
          // Start next work period
          setCurrentRound((r) => r + 1);
          setIsRestPeriod(false);
          setTimeLeft(parseInt(workDuration) * 60);
        } else {
          // End of all rounds
          resetTimer();
        }
      } else {
        // End of work period, start rest period
        setIsRestPeriod(true);
        setTimeLeft(parseInt(restDuration) * 60);
      }
    }
    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    currentRound,
    rounds,
    workDuration,
    restDuration,
    isRestPeriod,
  ]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleDurationChange = (value: string) => {
    setWorkDuration(value);
    if (!isRunning && value.length > 0) {
      setTimeLeft(parseInt(value) * 60);
      setCurrentRound(1);
      setIsRestPeriod(false);
      return;
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(parseInt(workDuration) * 60);
    setCurrentRound(1);
    setIsRestPeriod(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.timerCard}>
        <Text style={[styles.phaseText, { color: currentTheme.text }]}>
          {isRestPeriod ? "Rest Time" : "Work Time"} - Round {currentRound}/
          {rounds}
        </Text>

        <Text style={[styles.timerText, { color: currentTheme.text }]}>
          {formatTime(timeLeft)}
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Work Duration (minutes):</Text>
          <TextInput
            style={styles.input}
            value={workDuration}
            onChangeText={handleDurationChange}
            keyboardType="numeric"
            maxLength={2}
            editable={!isRunning}
          />

          <Text style={styles.label}>Rest Duration (minutes):</Text>
          <TextInput
            style={styles.input}
            value={restDuration}
            onChangeText={setRestDuration}
            keyboardType="numeric"
            maxLength={2}
            editable={!isRunning}
          />

          <Text style={styles.label}>Number of Rounds:</Text>
          <TextInput
            style={styles.input}
            value={rounds}
            onChangeText={setRounds}
            keyboardType="numeric"
            maxLength={2}
            editable={!isRunning}
          />
        </View>

        <View style={styles.progressContainer}>
          {Array.from({ length: parseInt(rounds) }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index + 1 < currentRound
                      ? currentTheme.primary
                      : index + 1 === currentRound
                      ? currentTheme.primary
                      : "#d1d5db",
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isRunning ? "#ef4444" : currentTheme.primary },
            ]}
            onPress={toggleTimer}
          >
            <Icon
              name={isRunning ? "pause" : "play-arrow"}
              size={24}
              color="white"
            />
            <Text style={styles.buttonText}>
              {isRunning ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetTimer}
          >
            <Icon name="refresh" size={24} color="white" />
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  timerCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#374151",
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#374151",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  resetButton: {
    backgroundColor: "#6b7280",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
