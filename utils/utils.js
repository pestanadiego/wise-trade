const truncateAddress = (address) => {
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

const toHex = (num) => {
  const val = Number(num);
  return `0x ${val.toString(16)}`;
};

export default { truncateAddress, toHex };
