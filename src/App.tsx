import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";

function App() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState<{ task: string; id: number }[]>([]);
  const [taskContract, setTaskContract] = useState<any>(null);
  let signer;

  const taskContractAddress = "0xb6A469B4c9C675dF80176674dFD9060549fb845F";
  const taskContractAbi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_task",
          type: "string",
        },
      ],
      name: "saveTask",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllTasks",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "task",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          internalType: "struct TodoTasks.Task[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  useEffect(() => {
    setup();
  }, []);
  const setup = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      await provider.send("eth_requestAccounts", []);
      const account = await provider.listAccounts();

      signer = provider.getSigner(account[0]);

      const taskContract = new ethers.Contract(
        taskContractAddress,
        taskContractAbi,
        signer
      );
      setTaskContract(taskContract);

      const res = await taskContract.getAllTasks();
      setTaskList(res.map((i: any, id: number) => ({ task: i.task, id })));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveTask = async () => {
    try {
      await taskContract.saveTask(task);
      await getTask();
    } catch (error) {
      console.log(error);
    }
  };
  const getTask = async () => {
    try {
      const res = await taskContract.getAllTasks();
      setTaskList(res.map((i: any, id: number) => ({ task: i.task, id })));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto">
      <input
        className="border-spacing-0"
        placeholder="Add Task.."
        type="text"
        onChange={({ target: { value } }) => setTask(value)}
        value={task}
      />
      <button
        className="bg-slate-300 p-2 cursor-pointer hover:bg-slate-200 rounded-md font-medium text-gray-600 m-1 shadow-md"
        onClick={handleSaveTask}
      >
        Add task
      </button>
      <button
        onClick={getTask}
        className="bg-purple-300 p-2 cursor-pointer hover:bg-purple-200 rounded-md font-medium text-gray-600 m-1 shadow-md"
      >
        Get task
      </button>
      {taskList.map((i) => (
        <div key={i.id}>{i.task}</div>
      ))}
    </div>
  );
}

export default App;
