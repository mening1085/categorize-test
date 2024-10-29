"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [lists, setLists] = useState([
    { name: "Apple", type: "Fruit" },
    { name: "Broccoli", type: "Vegetables" },
    { name: "Mushroom", type: "Vegetables" },
    { name: "Banana", type: "Fruit" },
    { name: "Tomato", type: "Vegetables" },
    { name: "Orange", type: "Fruit" },
    { name: "Mango", type: "Fruit" },
    { name: "Pineapple", type: "Fruit" },
    { name: "Cucumber", type: "Vegetables" },
    { name: "Watermelon", type: "Fruit" },
    { name: "Carrot", type: "Vegetables" },
  ]);
  const [fruits, setFruits] = useState<{ name: string; type: string }[]>([]);
  const [vegetables, setVegetables] = useState<{ name: string; type: string }[]>([]);

  // กำหนดตัวแปรเพื่อเก็บ timeoutId ของแต่ละ item
  const timeoutIds = useRef<{[key: string] : NodeJS.Timeout}>({});

  // เป็นฟังก์ชันที่ใช้ในการเลือก item จาก lists แล้วเพิ่มเข้าไปใน list(fruit, vagetable) ที่ต้องการ และลบออกจาก lists
  const moveItemToList = (item: any, listSetter: Function, removeFromList: Function, delay = 5000) => {
    // เพิ่ม item ที่ถูกเลือกเข้าไปใน state ของ list(fruit, vegetable)
    listSetter((prevList: any) => [...prevList, item]);

    // ลบ item ที่ถูกเลือกออกจาก lists
    setLists((prevLists) => prevLists.filter((list) => list.name !== item.name));

    // ใช้ setTimeout เพื่อเพิ่ม item ที่ถูกเลือกเข้าไปใน list(fruit, vegetable) ที่ต้องการ และลบออกจาก lists หลังจากเวลา delay ที่กำหนด
    const timeoutId = setTimeout(() => {
      removeFromList(item);
      addLists(item);
    }, delay);

    // ใช้เพื่อเก็บ timeoutId ของแต่ละ item เพื่อใช้ในการ clear timeout ในกรณีที่ item ถูกเลือกอีกครั้ง
    timeoutIds.current[item.name] = timeoutId;
  };

  // func ที่ใช้ในการเพิ่ม item ลงใน list(fruit, vegetable)
  const addItem = (item: any) => {
    if (item.type === "Fruit") {
      moveItemToList(item, setFruits, (item: any) =>
        setFruits((prevFruits) => prevFruits.filter((fruit) => fruit.name !== item.name))
      );
    } else {
      moveItemToList(item, setVegetables, (item: any) =>
        setVegetables((prevVegetables) => prevVegetables.filter((veg) => veg.name !== item.name))
      );
    }
  };

  // func ที่ใช้ในการลบ item ออกจาก list(fruit, vegetable)
  const setList = (item: any) => {
    // clear timeout ของ item ที่ถูกเลือกอีกครั้ง
    if(timeoutIds.current[item.name]) {
      clearTimeout(timeoutIds.current[item.name]);
      delete timeoutIds.current[item.name];
    }

    // ลบ item ที่ถูกเลือกออกจาก list(fruit, vegetable) ที่เก็บอยู่
    if (item.type === "Fruit") {
      setFruits((prevFruits) => prevFruits.filter((fruit) => fruit.name !== item.name));
    } else {
      setVegetables((prevVegetables) => prevVegetables.filter((veg) => veg.name !== item.name));
    }

    // เพิ่ม item ที่ถูกเลือกอีกครั้งเข้าไปใน lists
    addLists(item);
  };

  const addLists = (item: any) => {
    setLists((prevLists) => [...prevLists, item]);
  }

  return (
    <div className="h-[780px] flex  justify-center mt-12">
      <div className="grid grid-cols-3 w-[80%] gap-4">
        <div className="col-span-1 space-y-3">
          {lists.map((list) => (
            <button
              key={list.name}
              className="border h-[60px] rounded-md w-full shadow-md hover:bg-gray-50"
              onClick={() => addItem(list)}
            >
              {list.name}
            </button>
          ))}
        </div>
        <div className="col-span-1 border">
          <div className="bg-zinc-200 h-[60px] flex items-center justify-center">Fruits</div>
          {fruits.map((fruit) => (
            <button
              key={fruit.name}
              className="border h-[60px] rounded-md w-full shadow-md hover:bg-gray-50"
              onClick={() => setList(fruit)}
            >
              {fruit.name}
            </button>
          ))}
        </div>
        <div className="col-span-1 border">
          <div className="bg-zinc-200 h-[60px] flex items-center justify-center">Vegetables</div>
          {vegetables.map((veg) => (
            <button
              key={veg.name}
              className="border h-[60px] rounded-md w-full shadow-md hover:bg-gray-50"
              onClick={() => setList(veg)}
            >
              {veg.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
