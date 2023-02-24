const parseJwt = (rolToken) => {
    const tokenDecodablePart = rolToken.split('.')[1];
    const decoded = Buffer.from(tokenDecodablePart, 'base64').toString();
    //Retorna un array
    return decoded;
  };

module.exports = {
    parseJwt
}
