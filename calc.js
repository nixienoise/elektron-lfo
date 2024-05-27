const { createApp, ref } = Vue;

let speedMultiplier = 0.0078125; // 1/128

const multipliersData = [
  {
    label: "BPM 1",
    mult: 1,
    isFixed: false,
  },
  {
    label: "BPM 2",
    mult: 2,
    isFixed: false,
  },
  {
    label: "BPM 4",
    mult: 4,
    isFixed: false,
  },
  {
    label: "BPM 8",
    mult: 8,
    isFixed: false,
  },
  {
    label: "BPM 16",
    mult: 16,
    isFixed: false,
  },
  {
    label: "BPM 32",
    mult: 32,
    isFixed: false,
  },
  {
    label: "BPM 64",
    mult: 64,
    isFixed: false,
  },
  {
    label: "BPM 128",
    mult: 128,
    isFixed: false,
  },
  {
    label: "BPM 256",
    mult: 256,
    isFixed: false,
  },
  {
    label: "BPM 512",
    mult: 512,
    isFixed: false,
  },
  {
    label: "BPM 1k",
    mult: 1024,
    isFixed: false,
  },
  {
    label: "BPM 2k",
    mult: 2048,
    isFixed: false,
  },
  {
    label: "1",
    mult: 1,
    isFixed: true,
  },
  {
    label: "2",
    mult: 2,
    isFixed: true,
  },
  {
    label: "4",
    mult: 4,
    isFixed: true,
  },
  {
    label: "8",
    mult: 8,
    isFixed: true,
  },
  {
    label: "16",
    mult: 16,
    isFixed: true,
  },
  {
    label: "32",
    mult: 32,
    isFixed: true,
  },
  {
    label: "64",
    mult: 64,
    isFixed: true,
  },
  {
    label: "128",
    mult: 128,
    isFixed: true,
  },
  {
    label: "256",
    mult: 256,
    isFixed: true,
  },
  {
    label: "512",
    mult: 512,
    isFixed: true,
  },
  {
    label: "1k",
    mult: 1024,
    isFixed: true,
  },
  {
    label: "2k",
    mult: 2048,
    isFixed: true,
  },
];

createApp({
  setup() {
    const bpm = ref(120);
    const beatDuration = ref(0.5);
    const barDuration = ref(2);

    const lfoSpeed = ref(32.0);
    const multipliers = ref(multipliersData);
    const multiplier = ref(5);

    const timeOut = ref();
    const rateOut = ref();
    const hertzOut = ref();

    function onBpmInput(e) {
      bpm.value = e.target.value;

      // Assuming 4/4 time.
      // TODO: Check if the pattern scaling affects LFO timing?
      beatDuration.value = 60 / bpm.value;
      barDuration.value = beatDuration.value * 4;
      calculateRates();
    }

    function onLfoSpeedInput(e) {
      lfoSpeed.value = e.target.value;
      calculateRates();
    }

    function onMultiplierChange(e) {
      multiplier.value = parseInt(e.target.value);
      calculateRates();
    }

    function calculateRates() {
      const index = multiplier.value;
      rateOut.value = sensibleFixedNum(calculateRateFor(index));
      timeOut.value = sensibleFixedNum(calculateTimeFor(index));
      hertzOut.value = calculateHertzFor(index);
    }

    // While this function is called a lot, there are only 24 index options
    // I don't really feel the need to cache this, your computer, phone, what-have-you can handle it.
    function calculateRateFor(multiplierIndex) {
      let x = lfoSpeed.value * speedMultiplier;
      return 1 / x / multipliersData[multiplierIndex].mult;
    }

    function sensibleFixedNum(input) {
      return Math.round(input * 1000) / 1000;
    }

    function calculateNotationFor(multiplierIndex) {
      const rate = calculateRateFor(multiplierIndex);

      if (rate > 1) {
        return `${sensibleFixedNum(rate)}/1`;
      } else {
        return `1/${sensibleFixedNum(1 / rate)}`;
      }
    }

    function calculateTimeFor(multiplierIndex) {
      const rate = calculateRateFor(multiplierIndex);

      let duration = barDuration.value;
      if (multipliersData[multiplierIndex].isFixed) {
        // Fixed multiplier is based on 120 BPM
        duration = 2;
      }

      return (rate / 1) * duration;
    }

    function calculateHertzFor(multiplierIndex) {
      return sensibleFixedNum(1 / calculateTimeFor(multiplierIndex));
    }

    calculateRates();

    return {
      bpm,

      beatDuration,
      barDuration,

      onLfoSpeedInput,
      onMultiplierChange,
      onBpmInput,

      multipliers,
      multiplier,
      lfoSpeed,

      timeOut,
      rateOut,
      hertzOut,

      sensibleFixedNum,
      calculateNotationFor,
      calculateHertzFor,
      calculateTimeFor,
    };
  },
}).mount("#app");
