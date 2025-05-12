import React, { useState } from "react";
import { Card, CardContent, Button, Input } from "@/components/ui";

export default function PiknikPaylasim() {
  const [people, setPeople] = useState([{ name: "", amount: 0 }]);
  const [results, setResults] = useState([]);

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
    const payments = people.map(person => ({
      name: person.name,
      balance: person.amount - perPerson
    }));
    setResults(payments);
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
          {results.map((result, index) => (
            <p key={index}>{result.name}: {result.balance.toFixed(2)} TL</p>
          ))}
        </div>
      )}
    </div>
  );
}
