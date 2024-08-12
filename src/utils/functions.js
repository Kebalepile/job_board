export function scrollIntoView(selector, behaviour = "smooth") {
  const elem = document.querySelector(selector);
  elem.scrollIntoView({ behaviour });
  elem.focus();
}

export function toggleClass(bool, elem, className) {
  bool ? elem.classList.add(className) : elem.classList.remove(className);
}

export function generateRandomId(length = 10) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  const randomValues = new Uint32Array(length);

  crypto.getRandomValues(randomValues);

  let randomId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % charactersLength;
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}
