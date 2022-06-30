import { ethers } from 'ethers';

const truncateAddress = (address) => {
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

const validateEmail = (email) => {
  const validate = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return validate;
};

const validateAddress = (address) => {
  const validate = ethers.utils.isAddress(address);
  return validate;
};

const validateName = (name) => {
  if (isString(name) && name.trim().length !== 0 && name !== '') {
    return true;
  }
};

const isString = (input) => {
  if (Object.prototype.toString.call(input) === '[object String]') return true;
  else return false;
};

const validateTitle = (title) => {
  if (title.length > 64) {
    return 'The title cannot exceed 64 characters';
  } else if (!isString(title)) {
    return 'The input value must be a string';
  } else if (title === '' || title.trim().length === 0) {
    return 'The title must not be empty';
  } else {
    return 'OK';
  }
};

const validateDescription = (description) => {
  if (description.length > 256) {
    return 'The description cannot exceed 256 characters';
  } else {
    return 'OK';
  }
};

function makeKey() {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default {
  truncateAddress,
  validateEmail,
  validateAddress,
  validateTitle,
  validateDescription,
  validateName,
  makeKey,
};
