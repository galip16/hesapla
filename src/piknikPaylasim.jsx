import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";

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
      balance: person.amount - perPerson,
      owes: 0,
    }));

    // Ödeyenler ve alacaklılar
    const payees = payments.filter(payment => payment.balance < 0); // Ödeyenler
    const receivers = payments.filter(payment => payment.balance > 0); // Alacaklılar

    let payeeIndex = 0;
    let receiverIndex = 0;

    // Alacaklı ve ödeyen kişilerin ödeme ilişkisini kur
    const transactionList = [];

    while (payeeIndex < payees.length && receiverIndex < receivers.length) {
      const payee = payees[payeeIndex];
      const receiver = receivers[receiverIndex];

      // Ödeyen kişinin ödeyeceği ve alacaklı kişinin alacağı tutarı hesapla
      const amountToPay = Math.min(Math.abs(payee.balance), receiver.balance);

      payees[payeeIndex].owes += amountToPay;
      receivers[receiverIndex].owes -= amountToPay;

      // Ödeme yapılacak işlemi kaydet
      transactionList.push(`${payee.name} ${receiver.name}'e ${amountToPay.toFixed(2)} TL ödeyecek`);

      // Eğer payee borcunu tamamladıysa bir sonraki ödeyen kişiye geç
      if (payee.balance + amountToPay >= 0) {
        payeeIndex++;
      }
      // Eğer receiver borcunu tamamladıysa bir sonraki alacaklıya geç
      if (receiver.balance - amountToPay <= 0) {
        receiverIndex++;
      }
    }

    setResults(transactionList); // Sonuçları göster
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
            <p key={index}>{result}</p>
          ))}
        </div>
      )}
    </div>
  );
}
