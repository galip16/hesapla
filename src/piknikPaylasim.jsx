import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";

export default function PiknikPaylasim() {
  const [people, setPeople] = useState([{ name: "", amount: 0 }]);
  const [results, setResults] = useState([]);
  const [average, setAverage] = useState(0);

  const handleAddPerson = () => {
    setPeople([...people, { name: "", amount: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const updatedPeople = [...people];
    updatedPeople[index][field] = field === "amount" ? parseFloat(value) : value;
    setPeople(updatedPeople);
  };

  const calculatePayments = () => {
    const total = people.reduce((acc, person) => acc + person.amount, 0);
    const perPerson = total / people.length;
    setAverage(perPerson);

    const debtors = [];
    const creditors = [];

    people.forEach((person) => {
      const balance = person.amount - perPerson;
      if (balance > 0) creditors.push({ name: person.name, balance });
      else if (balance < 0) debtors.push({ name: person.name, balance: Math.abs(balance) });
    });

    const transactions = [];

    debtors.forEach((debtor) => {
      while (debtor.balance > 0) {
        const creditor = creditors[0];
        const payment = Math.min(debtor.balance, creditor.balance);

        transactions.push(`${debtor.name} ${creditor.name} 'e ${payment.toFixed(2)} TL ödeyecek`);

        debtor.balance -= payment;
        creditor.balance -= payment;

        if (creditor.balance === 0) creditors.shift();
      }
    });

    setResults(transactions);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Piknik Paylaşım Hesaplayıcı</h1>
      {people.map((person, index) => (
        <Card key={index}>
          <CardContent className="flex space-x-4">
            <Input
              placeholder="İsim"
              value={person.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <Input
              placeholder="Harcama"
              type="number"
              value={person.amount}
              onChange={(e) => handleChange(index, "amount", e.target.value)}
            />
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleAddPerson}>Kişi Ekle</Button>
      <Button onClick={calculatePayments}>Hesapla</Button>

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Sonuçlar:</h2>
          <p>Kişi başı ortalama ödeme: {average.toFixed(2)} TL</p>
          {results.map((result, index) => (
            <p key={index}>{result}</p>
          ))}
        </div>
      )}
    </div>
  );
}