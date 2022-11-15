import noUiSlider from 'nouislider';

const rangeSlider = document.getElementById("range-slider");

if (rangeSlider){
  noUiSlider.create(rangeSlider, {
    start: [2000, 25000],
    connect: true,
    step: 1,
    range: {
      'min': [2000],
      'max': [25000],
    }
  });

  const input0 = document.getElementById("input-0");
  const input1 = document.getElementById("input-1");
  const inputs = [input0, input1];

  rangeSlider.noUiSlider.on('update', function(values, handle){
    inputs[handle].value = Math.round(values[handle]);
  });

  const setRangeSlider = (i, value) => {
    let arr = [null, null];
    arr[i] = value;

    rangeSlider.noUiSlider.set(arr);
  }

  inputs.forEach((e1, index) => {
    e1.addEventListener('change', (e) =>{
      setRangeSlider(index, e.currentTarget.value)
    });
  });
}



