import Notiflix from 'notiflix';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;

      const result = { position, delay };

      if (shouldResolve) {
        resolve(result);
      } else {
        reject(result);
      }
    }, delay);
  });
}

document.querySelector('.form').addEventListener('submit', async event => {
  event.preventDefault();

  let firstDelay = parseInt(
    document.querySelector('input[name="delay"]').value
  );
  const step = parseInt(document.querySelector('input[name="step"]').value);
  const amount = parseInt(document.querySelector('input[name="amount"]').value);

  const handlePromise = async (position, delay) => {
    try {
      const result = await createPromise(position, delay);

      const fulfilledMessage = `Fulfilled promise ${result.position} in ${result.delay}ms`;
      Notiflix.Notify.success(fulfilledMessage, {
        cssAnimationDuration: 500,
      });
    } catch (error) {
      const { position, delay } = error;
      const rejectedMessage = `Rejected promise ${position} in ${delay}ms`;
      Notiflix.Notify.failure(rejectedMessage, {
        cssAnimationDuration: 500, //
      });
    }
  };

  for (let i = 1; i <= amount; i++) {
    await handlePromise(i, firstDelay);

    firstDelay += step;

    await new Promise(resolve => setTimeout(resolve, step));
  }
});
