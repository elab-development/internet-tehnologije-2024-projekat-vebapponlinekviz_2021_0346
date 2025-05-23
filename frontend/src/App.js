import './App.css';
import Cateogory from './Cateogory';
import Login from './Login';

function App() {
  const category1 = {
    number:1,
    name:"Kategorija1"
  }
  const category2 = {
    number:2,
    name:"Kategorija2"
  }
  const category3 = {
    number:3,
    name:"Kategorija3"
  }
  const category4 = {
    number:4,
    name:"Kategorija4"
  }
  return (
    <div className="App">
      <Cateogory category={category1}/>
    </div>
  );
}

export default App;
