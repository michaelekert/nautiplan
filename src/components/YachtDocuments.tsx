import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Bell, 
  BellOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ship,
  Calendar,
  Edit,
  Image,
  Upload,
  X,
  Eye
} from 'lucide-react';

interface YachtDocument {
  id: string;
  name: string;
  expiryDate: string;
  reminderDays: number;
  reminderEnabled: boolean;
  image?: string;
  createdAt: string;
}

const REMINDER_OPTIONS = [
  { value: 7, label: '7 dni przed' },
  { value: 14, label: '14 dni przed' },
  { value: 30, label: '30 dni przed' },
  { value: 60, label: '60 dni przed' },
  { value: 90, label: '90 dni przed' },
];

const STORAGE_KEY = 'yacht-documents';

export function YachtDocuments() {
  const [documents, setDocuments] = useState<YachtDocument[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<YachtDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    expiryDate: '',
    reminderDays: 14,
    reminderEnabled: true,
    image: '' as string | undefined,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDocuments(JSON.parse(stored));
      } catch (e) {
        console.error('Błąd wczytywania dokumentów:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  const resetForm = () => {
    setFormData({
      name: '',
      expiryDate: '',
      reminderDays: 14,
      reminderEnabled: true,
      image: undefined,
    });
    setEditingDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenDialog = (doc?: YachtDocument) => {
    if (doc) {
      setEditingDocument(doc);
      setFormData({
        name: doc.name,
        expiryDate: doc.expiryDate,
        reminderDays: doc.reminderDays,
        reminderEnabled: doc.reminderEnabled,
        image: doc.image,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Plik jest za duży. Maksymalny rozmiar to 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openPreview = (image: string) => {
    setPreviewImage(image);
    setIsPreviewOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.expiryDate) return;

    if (editingDocument) {
      setDocuments(docs => docs.map(doc => 
        doc.id === editingDocument.id
          ? { ...doc, ...formData }
          : doc
      ));
    } else {
      const newDoc: YachtDocument = {
        id: crypto.randomUUID(),
        name: formData.name,
        expiryDate: formData.expiryDate,
        reminderDays: formData.reminderDays,
        reminderEnabled: formData.reminderEnabled,
        image: formData.image,
        createdAt: new Date().toISOString(),
      };
      setDocuments(docs => [...docs, newDoc]);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const toggleReminder = (id: string) => {
    setDocuments(docs => docs.map(doc =>
      doc.id === id ? { ...doc, reminderEnabled: !doc.reminderEnabled } : doc
    ));
  };

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusInfo = (doc: YachtDocument) => {
    const daysLeft = getDaysUntilExpiry(doc.expiryDate);
    
    if (daysLeft < 0) {
      return {
        status: 'expired',
        label: 'Wygasł',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: AlertTriangle,
        iconColor: 'text-red-600',
      };
    }
    
    if (daysLeft <= doc.reminderDays && doc.reminderEnabled) {
      return {
        status: 'warning',
        label: `${daysLeft} dni`,
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: Clock,
        iconColor: 'text-amber-600',
      };
    }
    
    return {
      status: 'valid',
      label: `${daysLeft} dni`,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
    };
  };

  const expiringDocuments = documents.filter(doc => {
    const daysLeft = getDaysUntilExpiry(doc.expiryDate);
    return doc.reminderEnabled && daysLeft >= 0 && daysLeft <= doc.reminderDays;
  });

  const expiredDocuments = documents.filter(doc => getDaysUntilExpiry(doc.expiryDate) < 0);

  const sortedDocuments = [...documents].sort((a, b) => {
    const daysA = getDaysUntilExpiry(a.expiryDate);
    const daysB = getDaysUntilExpiry(b.expiryDate);
    return daysA - daysB;
  });

  return (
    <div className="space-y-6">
      {(expiringDocuments.length > 0 || expiredDocuments.length > 0) && (
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-amber-800">Uwaga!</CardTitle>
                <CardDescription className="text-amber-700">
                  Dokumenty wymagające uwagi
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {expiredDocuments.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-100 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-red-800 truncate">{doc.name}</p>
                    <p className="text-sm text-red-600">Wygasł {Math.abs(getDaysUntilExpiry(doc.expiryDate))} dni temu</p>
                  </div>
                </div>
              ))}
              {expiringDocuments.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-amber-100 border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-amber-800 truncate">{doc.name}</p>
                    <p className="text-sm text-amber-600">Wygasa za {getDaysUntilExpiry(doc.expiryDate)} dni</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">Dokumenty jachtu</CardTitle>
                <CardDescription className="text-slate-500">
                  Zarządzaj dokumentami i licencjami
                </CardDescription>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj dokument
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingDocument ? 'Edytuj dokument' : 'Dodaj nowy dokument'}
                  </DialogTitle>
                  <DialogDescription>
                    Wprowadź dane dokumentu i ustaw przypomnienie o wygaśnięciu.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nazwa dokumentu</Label>
                    <Input
                      id="name"
                      placeholder="np. Ubezpieczenie OC 2025"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Data ważności
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder" className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Przypomnij przed wygaśnięciem
                    </Label>
                    <Select
                      value={formData.reminderDays.toString()}
                      onValueChange={(value) => setFormData({ ...formData, reminderDays: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REMINDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Zdjęcie dokumentu
                    </Label>
                    {formData.image ? (
                      <div className="relative">
                        <img 
                          src={formData.image} 
                          alt="Podgląd dokumentu" 
                          className="w-full h-40 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600">Kliknij aby dodać zdjęcie</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG do 5MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Anuluj
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.expiryDate}
                  >
                    {editingDocument ? 'Zapisz zmiany' : 'Dodaj dokument'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">Brak dokumentów</h3>
              <p className="text-slate-500 mb-4">Dodaj pierwszy dokument jachtu, aby śledzić jego ważność.</p>
              <Button onClick={() => handleOpenDialog()} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Dodaj dokument
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-[calc(100vw-3rem)] sm:max-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dokument</TableHead>
                    <TableHead>Ważność</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDocuments.map((doc) => {
                    const statusInfo = getStatusInfo(doc);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor} sm:hidden`} />
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-medium truncate max-w-[150px] sm:max-w-none">{doc.name}</p>
                                {doc.image && <Image className="w-3 h-3 text-slate-400" />}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm whitespace-nowrap">
                            {new Date(doc.expiryDate).toLocaleDateString('pl-PL')}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {doc.image && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openPreview(doc.image!)}
                                title="Zobacz zdjęcie"
                              >
                                <Eye className="w-4 h-4 text-slate-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleReminder(doc.id)}
                              title={doc.reminderEnabled ? 'Wyłącz przypomnienie' : 'Włącz przypomnienie'}
                            >
                              {doc.reminderEnabled ? (
                                <Bell className="w-4 h-4 text-blue-600" />
                              ) : (
                                <BellOff className="w-4 h-4 text-slate-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(doc)}
                            >
                              <Edit className="w-4 h-4 text-slate-600" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Usuń dokument</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Czy na pewno chcesz usunąć dokument "{doc.name}"? 
                                    Tej operacji nie można cofnąć.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(doc.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Usuń
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Podgląd dokumentu</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Podgląd dokumentu" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}