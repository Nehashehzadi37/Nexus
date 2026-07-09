import React, { useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Send,
  HandCoins,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
const startups = [
  {
    id: 1,
    name: "Sarah Johnson",
    startup: "TechWave AI",
  },
  {
    id: 2,
    name: "David Chen",
    startup: "GreenLife Solutions",
  },
  {
    id: 3,
    name: "Maya Patel",
    startup: "HealthPulse",
  },
];
interface Transaction {
  id: number;
  type: "Deposit" | "Withdraw" | "Transfer" | "Funding";
  amount: number;
  sender: string;
  receiver: string;
  status: "Completed" | "Pending";
}
export const PaymentPage: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState(25000);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "Deposit",
      amount: 5000,
      sender: "Bank",
      receiver: "Wallet",
      status: "Completed",
    },
    {
      id: 2,
      type: "Funding",
      amount: 15000,
      sender: "Investor",
      receiver: "Entrepreneur",
      status: "Completed",
    },
  ]);
  const addTransaction = (
    type: Transaction["type"],
    sender: string,
    receiver: string
  ) => {
    const value = Number(amount);
    if (!value) return;
    setWalletBalance((prev) => {
      if(type === "Withdraw") {
        return prev - value;
      }
      return prev + value;
    });
    setTransactions((prev)=>[
      {
        id: Date.now(),
        type,
        amount:value,
        sender,
        receiver,
        status:"Completed",
      },
      ...prev
    ]);
    setAmount("");
  };
  const [selectedStartup, setSelectedStartup] = useState(
  startups[0]
);
  const transferMoney = () => {
    const value = Number(amount);
    if(!value) return;
    setWalletBalance(prev => prev - value);
    setTransactions(prev=>[
      {
        id:Date.now(),
        type:"Transfer",
        amount:value,
        sender:"My Wallet",
        receiver:"Another User",
        status:"Completed"
      },
      ...prev
    ]);
    setAmount("");
  };
  const fundStartup = () => {
    const value = Number(amount);
    if(!value) return;
    setWalletBalance(prev=>prev-value);
    setTransactions(prev=>[
      {
        id:Date.now(),
        type:"Funding",
        amount:value,
        sender:"Investor",
        receiver:"Entrepreneur",
        status:"Completed"
      },
      ...prev
    ]);
    setAmount("");
  };
return (
<div className="space-y-6 animate-fade-in">
{/* Header */}
<div>
<h1 className="text-3xl font-bold text-gray-900">
Payments
</h1>
<p className="text-gray-600">
Secure payment management and startup funding
</p>
</div>
{/* Wallet + Actions */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<Card>
<CardHeader>
<h2 className="flex items-center gap-2 font-semibold">
<Wallet size={22}/>
Wallet Balance
</h2>
</CardHeader>
<CardBody>
<h1 className="text-4xl font-bold text-primary-600">
${walletBalance.toLocaleString()}
</h1>
<p className="text-gray-500 mt-2">
Available balance
</p>
</CardBody>
</Card>
<Card className="lg:col-span-2">
<CardHeader>
<h2 className="font-semibold">
Payment Actions
</h2>
</CardHeader>
<CardBody className="space-y-4">
<input type="number" placeholder="Enter Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2"/>
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
<Button onClick={()=>addTransaction("Deposit","Bank","Wallet")}leftIcon={<ArrowDownCircle size={18}/>}>
Deposit
</Button>
<Button onClick={()=> addTransaction("Withdraw","Wallet","Bank")} leftIcon={<ArrowUpCircle size={18}/>}>
Withdraw
</Button>
<Button onClick={transferMoney}leftIcon={<Send size={18}/>}>
Transfer
</Button>
<Button onClick={fundStartup} leftIcon={<HandCoins size={18}/>}>
Fund Startup
</Button>
</div>
</CardBody>
</Card>
<Card>

<CardHeader>
<h2 className="font-semibold flex items-center gap-2">
<HandCoins size={20}/>
Funding Deal
</h2>
</CardHeader>


<CardBody className="space-y-4">


<p className="text-gray-600">
Investor → Entrepreneur Funding
</p>


<select
className="w-full border rounded-lg px-3 py-2"
value={selectedStartup.id}
onChange={(e)=>{

const startup = startups.find(
(s)=>s.id === Number(e.target.value)
);

if(startup){
setSelectedStartup(startup);
}

}}
>

{
startups.map((startup)=>(
<option
key={startup.id}
value={startup.id}
>
{startup.startup}
</option>
))
}

</select>



<div className="border rounded-lg p-3">

<p className="font-medium">
Entrepreneur:
</p>

<p>
{selectedStartup.name}
</p>


<p className="font-medium mt-2">
Startup:
</p>

<p>
{selectedStartup.startup}
</p>


</div>



<Button
onClick={()=>{

const value = Number(amount);

if(!value) return;


setWalletBalance(
prev=>prev-value
);


setTransactions(prev=>[
{
id:Date.now(),
type:"Funding",
amount:value,
sender:"Investor",
receiver:selectedStartup.startup,
status:"Completed"
},
...prev
]);


setAmount("");

alert(
`Successfully funded ${selectedStartup.startup}`
);

}}

leftIcon={<HandCoins size={18}/>}
>

Fund Startup

</Button>


</CardBody>

</Card>
</div>
{/* Transaction History */}
<Card>
<CardHeader>
<h2 className="font-semibold text-lg">
Transaction History
</h2>
</CardHeader>
<CardBody>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead className="border-b">
<tr>
<th className="text-left p-3">
Type
</th>
<th className="text-left p-3">
Amount
</th>
<th className="text-left p-3">
Sender
</th>
<th className="text-left p-3">
Receiver
</th>
<th className="text-left p-3">
Status
</th>
</tr>
</thead>
<tbody>
{transactions.map((transaction)=>(
<tr
key={transaction.id}
className="border-b">
<td className="p-3">
{transaction.type}
</td>
<td className="p-3">
${transaction.amount.toLocaleString()}
</td>
<td className="p-3">
{transaction.sender}
</td>
<td className="p-3">
{transaction.receiver}
</td>
<td className="p-3">
<span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
{transaction.status}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</CardBody>
</Card>
</div>
);
};