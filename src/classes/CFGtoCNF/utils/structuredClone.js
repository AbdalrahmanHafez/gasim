// import v8 from 'v8';
const structuredClone = (cfg) => {
  // return v8.deserialize(v8.serialize(cfg));
  return JSON.parse(JSON.stringify(cfg));
};
export default structuredClone;
