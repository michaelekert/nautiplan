import { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ArrowLeft,
} from 'lucide-react';

import { CruiseOpinions } from "@/components/CruiseOpinions";

export default function DocumentsSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const documents = [
    {
      id: 'cruise-opinions',
      title: 'Opinie z rejsu',
      description: 'Formularze oceny załogi',
      icon: FileText,
      color: 'text-blue-600'
    },
  ];

  const renderSection = () => {
    switch (selectedCard) {
      case 'cruise-opinions':
        return <CruiseOpinions />;

      default:
        return null;
    }
  };

  if (selectedCard) {
    return (
      <div className="space-y-6">
        <Button onClick={() => setSelectedCard(null)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do dokumentów
        </Button>

        {renderSection()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const Icon = doc.icon;
          return (
            <Card 
              key={doc.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCard(doc.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gray-50 ${doc.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {doc.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
