import Notiflix from 'notiflix';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;

      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

document.querySelector('.form').addEventListener('submit', async event => {
  event.preventDefault();

  const delay = parseInt(document.querySelector('input[name="delay"]').value);
  const step = parseInt(document.querySelector('input[name="step"]').value);
  const amount = parseInt(document.querySelector('input[name="amount"]').value);

  const promises = [];

  for (let i = 1; i <= amount; i++) {
    promises.push(createPromise(i, delay));
  }

  const results = await Promise.allSettled(promises);

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      const { position, delay } = result.value;
      Notiflix.Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
    } else {
      const { position, delay } = result.reason;
      Notiflix.Notify.failure(`Rejected promise ${position} in ${delay}ms`);
    }
  });
});
