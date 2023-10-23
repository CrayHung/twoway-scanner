import React, { useEffect, useState } from 'react';



function App() {

  const [string, setString] = useState("");
  const [lprData,setLprData] = useState<any[]>([]);

  useEffect(() => {


    fetch("http://127.0.0.1:8080/hello")
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.text();
      })
      .then(data=>setString(data))

      .catch((err) => {
        console.log(err.message);
      });




      fetch("http://127.0.0.1:8080/lpr/all")
      .then(response => response.json())
      .then(data => {
        setLprData(data);
        console.log("get from /lpr/all"+data.id);
      });
 

    


  }, []);

  // const items = lprData.map((item, index) => (
  //   <li key={index}>{item}</li>
  // ));
  

  return (
    <>
      <div>
        from react
      </div>
      <div>
        {string}
      </div>
        <ul>
            {lprData.map((jsonObject) => (
              <li key={jsonObject.id}>
                <p>plateNumber: {jsonObject.plateNumber}</p>
                <p>vehicleType: {jsonObject.vehicleType}</p>
              </li>
            ))}
          </ul>

      {/* {items} */}
      <div>
        from react end
      </div>
    </>
  );
}

export default App;
