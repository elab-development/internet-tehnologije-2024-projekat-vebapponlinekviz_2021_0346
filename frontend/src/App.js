import './App.css';
import Cateogory from './Cateogory';
import Login from './Login';
import Score from './Score';

function App() {
  const category1 = {
    number:1,
    name:"Kategorija 1"
  }
  const category2 = {
    number:2,
    name:"Kategorija 2"
  }
  const category3 = {
    number:3,
    name:"Kategorija 3"
  }
  const category4 = {
    number:4,
    name:"Kategorija 4"
  }
  return (
    <div className="App">
     <Score category={category4} />
    </div>
  );
}

export default App;
