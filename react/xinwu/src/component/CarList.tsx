import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../global';

interface CarData {
  id: number;
  carType: string;
  amount: number;
}

interface CarListProps {
  data: CarData[];
}

const CarList: React.FC<CarListProps> = ({ data }) => {
  return (
    <div>
      <h2>Car List</h2>
      <ul>
        {data.map((car) => (
          <li key={car.id}>
            <strong>Car Type:</strong> {car.carType}, <strong>Amount:</strong> {car.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CarListWithFetch: React.FC = () => {
  const [parking, setParking] = useState<CarData[]>([]);
  const { jwtToken,setJwtToken,isLoggedIn, setIsLoggedIn,globalUrl , cam1LatestData ,setCam1LatestData, cam2LatestData, setCam2LatestData } = useGlobalContext();

  useEffect(() => {
    const fetchParkingLot = async () => {
      try {
        const response = await fetch(`${globalUrl.url}/parking/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get parkinglot info');
        }

        const data: CarData[] = await response.json();
        console.log("parking lot info : " + JSON.stringify(data));
        setParking(data);

      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchParkingLot();
  }, [cam1LatestData,cam2LatestData]); 

  return <CarList data={parking} />;
};

export default CarListWithFetch;
