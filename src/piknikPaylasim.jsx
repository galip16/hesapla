import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";

export default function PiknikPaylasim() {
  const [people, setPeople] = useState([
    { name: "", amount: 0, isGuest: false, sponsors: [], weight: 1 },
  ]);
  const [results, setResults] = useState([]);
  const [average, setAverage] = useState(0);

  const handleAddPerson = () => {
    setPeople([
      ...people,
      { name: "", amount: 0, isGuest: false, sponsors: [], weight: 1 },
    ]);
  };

  const handleRemovePerson = (index) => {
    const updatedPeople = [...people];
    updatedPeople.splice(index, 1);
    setPeople(updatedPeople);
  };

  const handleChange = (index, field, value) => {
    const updatedPeople = [...people];

    if (field === "sponsors") {
      if (updatedPeople[index].sponsors.includes(value)) {
        updatedPeople[index].sponsors =
          updatedPeople[index].sponsors.filter((s) => s !== value);
      } else {
        updatedPeople[index].sponsors.push(value);
      }
    } else if (field === "amount" || field === "weight") {
      updatedPeople[index][field] = parseFloat(value) || 0;
    } else {
      updatedPeople[index][field] = value;
    }

    setPeople(updatedPeople);
  };

  const calculatePayments = () => {
    let total = 0;
    let sponsorsTotal = 0;

    // Toplam harcama
    people.forEach((person) => {
      if (!person.isGuest) {
        total += person.amount;
      } else {
        sponsorsTotal += person.amount;
      }
    });

    // 🔥 SADECE misafir olmayanların katsayısı alınır
    const totalWeight = people
      .filter((p) => !p.isGuest)
      .reduce((sum, p) => sum + (p.weight || 1), 0);

    const perUnit = (total + sponsorsTotal) / totalWeight;
    setAverage(perUnit);

    const debtors = [];
    const creditors = [];

    people.forEach((person) => {
      if (person.isGuest) return;

      const expected = (person.weight || 1) * perUnit;
      let balance = person.amount - expected;

      // Misafir masrafını sponsorlarına böl
      people
        .filter((p) => p.isGuest && p.sponsors.includes(person.name))
        .forEach((guest) => {
          const share = guest.amount / guest.sponsors.length;
          balance -= share;
        });

      if (balance > 0) {
        creditors.push({ name: person.name, balance });
      } else if (balance < 0) {
        debtors.push({ name: person.name, balance: Math.abs(balance) });
      }
    });

    const transactions = [];

    debtors.forEach((debtor) => {
      while (debtor.balance > 0 && creditors.length > 0) {
        const creditor = creditors[0];

        const payment = Math.min(debtor.balance, creditor.balance);

        transactions.push(
          `${debtor.name}, ${creditor.name}'e ${payment.toFixed(2)} TL ödeyecek`
        );

        debtor.balance -= payment;
        creditor.balance -= payment;

        if (creditor.balance <= 0) creditors.shift();
      }
    });

    setResults(transactions);
  };

  const refreshPage = () => {
    setPeople([
      { name: "", amount: 0, isGuest: false, sponsors: [], weight: 1 },
    ]);
    setResults([]);
    setAverage(0);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Piknik Paylaşım Hesaplayıcı</h1>

      {people.map((person, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col space-y-2">
            <Input
              placeholder="İsim"
              value={person.name}
              onChange={(e) =>
                handleChange(index, "name", e.target.value)
              }
            />

            <Input
              placeholder="Harcama"
              type="number"
              value={person.amount}
              onChange={(e) =>
                handleChange(index, "amount", e.target.value)
              }
            />

            <Input
              placeholder="Katsayı (örn: 2)"
              type="number"
              value={person.weight}
              onChange={(e) =>
                handleChange(index, "weight", e.target.value)
              }
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={person.isGuest}
                onChange={(e) =>
                  handleChange(index, "isGuest", e.target.checked)
                }
              />
              <span>Misafir</span>
            </label>

            {person.isGuest && (
              <div>
                <h4 className="font-semibold">Masrafı Paylaşanlar:</h4>
                {people
                  .filter((p, i) => i !== index)
                  .map((p) => (
                    <label
                      key={p.name}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={person.sponsors.includes(p.name)}
                        onChange={() =>
                          handleChange(index, "sponsors", p.name)
                        }
                      />
                      <span>{p.name || "?"}</span>
                    </label>
                  ))}
              </div>
            )}

            <Button onClick={() => handleRemovePerson(index)}>
              Kişiyi Çıkar
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="space-x-4 mt-4">
        <Button onClick={handleAddPerson}>Kişi Ekle</Button>
        <Button onClick={calculatePayments}>Hesapla</Button>
        <Button onClick={refreshPage}>Yenile</Button>
      </div>

      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Sonuçlar:</h2>
          <p>
            Birim başı ödeme: {average.toFixed(2)} TL
          </p>
          {results.map((result, index) => (
            <p key={index}>{result}</p>
          ))}
        </div>
      )}
    </div>
  );
}