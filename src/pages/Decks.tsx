import { useAppStore } from '@/stores/appStore';
import { DeckCard } from '@/components/deck/DeckCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Decks() {
  const { decks } = useAppStore();
  const [search, setSearch] = useState('');

  const filteredDecks = decks.filter(
    (deck) =>
      deck.title.toLowerCase().includes(search.toLowerCase()) ||
      deck.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-4xl text-foreground">My Decks</h1>
          <Link to="/create">
            <Button size="sm" className="gradient-primary text-primary-foreground">
              <PlusCircle className="w-4 h-4 mr-2" />
              New
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search decks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {/* Decks List */}
        {filteredDecks.length > 0 ? (
          <div className="space-y-3">
            {filteredDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        ) : decks.length === 0 ? (
          <Card className="p-8 text-center gradient-card border-border/50">
            <p className="text-muted-foreground mb-4">No decks created yet.</p>
            <Link to="/create">
              <Button className="gradient-primary text-primary-foreground">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Deck
              </Button>
            </Link>
          </Card>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No decks match "{search}"
          </p>
        )}
      </div>
    </div>
  );
}
