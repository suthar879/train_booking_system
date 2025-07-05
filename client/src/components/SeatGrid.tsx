// src/components/SeatGrid.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MAX_SELECTION = 7;
const TOTAL_SEATS = 80;

export default function SeatGrid() {
  const [seatCount, setSeatCount] = useState<number>(1);
  const [bookedSeats, setBookedSeats] = useState<number[]>([12, 13, 14, 50]); // Mocked reserved seats
  const [userSeats, setUserSeats] = useState<number[]>([]);

  const handleBooking = () => {
    if (seatCount < 1 || seatCount > MAX_SELECTION) {
      toast.error('You can book between 1 and 7 seats.');
      return;
    }

    const availableSeats = Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).filter(
      (n) => !bookedSeats.includes(n)
    );

    const assigned = findBestSeats(availableSeats, seatCount);

    if (assigned.length < seatCount) {
      toast.error('Not enough adjacent seats available');
      return;
    }

    setBookedSeats((prev) => [...prev, ...assigned]);
    setUserSeats(assigned);
    toast.success(`Booked seats: ${assigned.join(', ')}`);
  };

  const findBestSeats = (available: number[], count: number): number[] => {
    const rows: number[][] = [];
    let index = 0;

    for (let row = 1; row <= 11; row++) {
      const rowSeats = [];
      for (let i = 0; i < 7; i++) rowSeats.push(index++ + 1);
      rows.push(rowSeats);
    }

    rows.push([78, 79, 80]); // Last row with 3 seats

    // Try to find in one row
    for (const row of rows) {
      const candidates = row.filter((n) => available.includes(n));
      if (candidates.length >= count) {
        return candidates.slice(0, count);
      }
    }

    // Fallback: pick closest available (not necessarily same row)
    return available.slice(0, count);
  };

  const renderSeats = () => {
    const seats: JSX.Element[] = [];
    let seatNumber = 1;

    for (let row = 1; row <= 12; row++) {
      const seatsInRow = row === 12 ? 3 : 7;
      const rowSeats = [];

      for (let i = 0; i < seatsInRow; i++) {
        const isBooked = bookedSeats.includes(seatNumber);
        const isUser = userSeats.includes(seatNumber);

        rowSeats.push(
          <div
            key={seatNumber}
            className={cn(
              'w-10 h-10 rounded text-sm flex items-center justify-center border shadow',
              isBooked
                ? isUser
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-400 text-white'
                : 'bg-white'
            )}
          >
            {seatNumber}
          </div>
        );

        seatNumber++;
      }

      seats.push(
        <div key={row} className="flex gap-2 mb-3 justify-center">
          {rowSeats}
        </div>
      );
    }

    return seats;
  };

  return (
    <div className="mt-6 max-w-xl mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">Book Your Train Seats</h2>

      <div className="flex items-center justify-center gap-4 mb-4">
        <Input
          type="number"
          min={1}
          max={7}
          value={seatCount}
          onChange={(e) => setSeatCount(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={handleBooking}>Book Seats</Button>
      </div>

      {renderSeats()}

      {userSeats.length > 0 && (
        <p className="mt-4 text-muted-foreground text-sm">
          ✅ You booked: <span className="font-medium">{userSeats.join(', ')}</span>
        </p>
      )}
    </div>
  );
}
