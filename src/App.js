import Router from "./router";
function App() {
  console.log(process.env.REACT_APP_ENV);
  return (
    <>
      <Router />
    </>
  );
}

export default App;
