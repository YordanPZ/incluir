import React, { useState } from 'react';
import { View, Linking, ScrollView, StyleSheet } from 'react-native';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  MapPin,
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  MessageSquare,
  Navigation
} from 'lucide-react-native';
import {
  PrestacionCompleta,
  prestacionService,
  ValidacionUbicacionResult
} from '../services/prestacionService';
import { useLocation } from '../hooks/useLocation';
import { useDevMode } from '../contexts/DevModeContext';

interface Props {
  visible: boolean;
  prestacion: PrestacionCompleta | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CompletarPrestacionModal({ visible, prestacion, onClose, onSuccess }: Props) {
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestLocation } = useLocation();
  const { settings } = useDevMode();

  // Estados para modales
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrorModalOpen, setValidationErrorModalOpen] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Estado para ubicación actual (para direcciones)
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  if (!prestacion) return null;

  const puedeCompletarPorTiempo = !prestacionService.esFechaVencida(prestacion.fecha);
  const puedeCompletar = puedeCompletarPorTiempo || settings.skipTimeValidation;
  const minutosRestantes = Math.abs(prestacionService.obtenerMinutosRestantes(prestacion.fecha));

  const handleCompletar = async () => {
    try {
      setLoading(true);

      // Obtener ubicación actual
      const ubicacion = await requestLocation();
      if (!ubicacion) {
        setErrorMessage('No se pudo obtener tu ubicación. Verifica que el GPS esté activado y los permisos estén concedidos.');
        setErrorModalOpen(true);
        return;
      }

      // Guardar ubicación actual para usar en direcciones si falla la validación
      setCurrentLocation(ubicacion);

      // Validar y cerrar prestación
      const resultado: ValidacionUbicacionResult = await prestacionService.cerrarPrestacionConValidacion(
        prestacion.prestacion_id,
        ubicacion.latitude,
        ubicacion.longitude,
        notas,
        { skipLocationValidation: settings.skipLocationValidation }
      );

      if (resultado.exito) {
        setSuccessModalOpen(true);
      } else {
        // Mejorar el mensaje de error con información de distancia
        const mensajeMejorado = `${resultado.mensaje}\n\nDistancia actual: ${Math.round(resultado.distancia_metros)}m (máximo permitido: 50m)`;
        setValidationErrorMessage(mensajeMejorado);
        setValidationErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Error completando prestación:', error);
      setErrorMessage('Error de conexión. La prestación se guardó offline y se sincronizará automáticamente.');
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    setNotas('');
    onSuccess();
    onClose();
  };

  const handleContactSupport = () => {
    setValidationErrorModalOpen(false);
    setContactModalOpen(true);
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+5491123456789&text=Necesito ayuda con validación de ubicación');
    setContactModalOpen(false);
  };

  const handleCall = () => {
    Linking.openURL('tel:+5491123456789');
    setContactModalOpen(false);
  };

  const handleCallPatient = () => {
    Linking.openURL(`tel:${prestacion.paciente_telefono}`);
  };

  const handleOpenMap = () => {
    const url = `https://maps.google.com/?q=${prestacion.ubicacion_paciente_lat},${prestacion.ubicacion_paciente_lng}`;
    Linking.openURL(url);
  };

  const handleOpenDirections = () => {
    if (!currentLocation) {
      setErrorMessage('No se pudo obtener tu ubicación actual para las direcciones');
      setErrorModalOpen(true);
      return;
    }

    // URL para Google Maps con direcciones desde ubicación actual hasta destino
    const directionsUrl = `https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${prestacion.ubicacion_paciente_lat},${prestacion.ubicacion_paciente_lng}`;

    Linking.openURL(directionsUrl);
    setValidationErrorModalOpen(false);
  };

  return (
    <>
      <Dialog open={visible} onOpenChange={onClose}>
        <DialogContent style={styles.dialogContent}>
          <DialogHeader style={styles.header}>
            <View style={styles.headerContent}>
              <DialogTitle>
                <Text variant="h2">Completar Prestación</Text>
              </DialogTitle>
              <Button variant="ghost" size="sm" onPress={onClose}>
                <X size={20} color="#6b7280" />
              </Button>
            </View>
          </DialogHeader>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Información del Paciente */}
            <Card style={styles.card}>
              <CardHeader style={styles.cardHeader}>
                <View style={styles.patientHeader}>
                  <User size={20} color="#3b82f6" />
                  <Text variant="h3" style={styles.patientName}>{prestacion.paciente_nombre}</Text>
                </View>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <MapPin size={16} color="#6b7280" />
                  <Text variant="small" style={styles.infoText}>
                    {prestacion.paciente_direccion}
                  </Text>
                  <Button variant="outline" size="sm" onPress={handleOpenMap}>
                    <View style={styles.buttonContent}>
                      <Navigation size={14} color="#3b82f6" />
                      <Text style={styles.buttonText}>Mapa</Text>
                    </View>
                  </Button>
                </View>

                <View style={styles.infoRow}>
                  <Phone size={16} color="#6b7280" />
                  <Text variant="small" style={styles.infoText}>
                    {prestacion.paciente_telefono}
                  </Text>
                  <Button variant="outline" size="sm" onPress={handleCallPatient}>
                    <View style={styles.buttonContent}>
                      <Phone size={14} color="#3b82f6" />
                      <Text style={styles.buttonText}>Llamar</Text>
                    </View>
                  </Button>
                </View>

                <View style={styles.infoRow}>
                  <Clock size={16} color="#6b7280" />
                  <Text variant="small" style={styles.infoText}>
                    {prestacionService.formatearFecha(prestacion.fecha, 'HH:mm')}
                  </Text>
                  <Badge variant={puedeCompletarPorTiempo ? "default" : "secondary"}>
                    <Text style={styles.badgeText}>
                      {puedeCompletarPorTiempo ? 'Disponible' : `${minutosRestantes}min restantes`}
                    </Text>
                  </Badge>
                </View>
              </CardContent>
            </Card>

            {/* Estado de Validación */}
            {!puedeCompletar && (
              <Card style={[styles.card, styles.warningCard]}>
                <CardContent style={styles.cardContent}>
                  <View style={styles.warningContent}>
                    <AlertTriangle size={18} color="#f59e0b" />
                    <Text variant="small" style={styles.warningText}>
                      Faltan {minutosRestantes} minutos para completar esta prestación
                    </Text>
                  </View>
                </CardContent>
              </Card>
            )}

            {/* Notas */}
            <Card style={styles.card}>
              <CardHeader style={styles.cardHeader}>
                <View style={styles.notesHeader}>
                  <MessageSquare size={18} color="#3b82f6" />
                  <Text variant="h4">Notas de la Prestación</Text>
                </View>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                <Textarea
                  placeholder="Agregar observaciones sobre la prestación realizada..."
                  value={notas}
                  onChangeText={setNotas}
                  style={styles.textarea}
                />
              </CardContent>
            </Card>

            {/* Estado de Permisos */}
            <Card style={[styles.card, styles.successCard]}>
              <CardContent style={styles.cardContent}>
                <View style={styles.successContent}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <Text variant="small" style={styles.successText}>
                    Sistema listo para validar ubicación
                  </Text>
                </View>
              </CardContent>
            </Card>
          </ScrollView>

          <DialogFooter style={styles.footer}>
            <View style={styles.footerButtons}>
              <Button
                variant="outline"
                style={styles.cancelButton}
                onPress={onClose}
                disabled={loading}
              >
                <Text>Cancelar</Text>
              </Button>

              <Button
                style={styles.completeButton}
                onPress={handleCompletar}
                disabled={!puedeCompletar || loading}
              >
                <View style={styles.completeButtonContent}>
                  {loading && <Loader2 size={16} color="#ffffff" />}
                  <Text style={styles.completeButtonText}>
                    {loading ? 'Completando...' : 'Completar'}
                  </Text>
                </View>
              </Button>
            </View>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Éxito */}
      <AlertDialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <View style={styles.modalIconContainer}>
              <CheckCircle2 size={48} color="#10b981" />
              <AlertDialogTitle style={styles.modalTitle}>¡Prestación Completada!</AlertDialogTitle>
            </View>
            <AlertDialogDescription style={styles.modalDescription}>
              La prestación se completó exitosamente y se ha actualizado en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={handleSuccessClose} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Continuar</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Error */}
      <AlertDialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <View style={styles.modalIconContainer}>
              <AlertTriangle size={48} color="#ef4444" />
              <AlertDialogTitle style={styles.modalTitle}>Error</AlertDialogTitle>
            </View>
            <AlertDialogDescription style={styles.modalDescription}>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={() => setErrorModalOpen(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Entendido</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Error de Validación */}
      <AlertDialog open={validationErrorModalOpen} onOpenChange={setValidationErrorModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <View style={styles.modalIconContainer}>
              <MapPin size={48} color="#f59e0b" />
              <AlertDialogTitle style={styles.modalTitle}>Validación de Ubicación</AlertDialogTitle>
            </View>
            <AlertDialogDescription style={styles.modalDescription}>
              {validationErrorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={styles.modalFooterColumn}>
            {/* Botón de Direcciones - Solo si tenemos ubicación actual */}
            {currentLocation && (
              <AlertDialogAction onPress={handleOpenDirections} style={[styles.modalButton, styles.directionsButton]}>
                <View style={styles.directionsButtonContent}>
                  <Navigation size={16} color="#ffffff" />
                  <Text style={styles.modalButtonText}>Ver Cómo Llegar</Text>
                </View>
              </AlertDialogAction>
            )}

            <AlertDialogAction onPress={handleContactSupport} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Contactar Soporte</Text>
            </AlertDialogAction>

            <AlertDialogCancel style={styles.modalCancelButton}>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Contactar Soporte */}
      <AlertDialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={styles.modalTitle}>Contactar Soporte</AlertDialogTitle>
            <AlertDialogDescription style={styles.modalDescription}>
              Elige cómo deseas contactar al equipo de soporte técnico
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={styles.modalFooterColumn}>
            <AlertDialogAction onPress={handleWhatsApp} style={[styles.modalButton, styles.whatsappButton]}>
              <Text style={styles.modalButtonText}>WhatsApp</Text>
            </AlertDialogAction>
            <AlertDialogAction onPress={handleCall} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Llamar</Text>
            </AlertDialogAction>
            <AlertDialogCancel style={styles.modalCancelButton}>
              <Text>Cancelar</Text>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const styles = StyleSheet.create({
  dialogContent: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: '#6b7280',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  badgeText: {
    fontSize: 12,
  },
  warningCard: {
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    color: '#92400e',
    flex: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  successCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    color: '#065f46',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  completeButton: {
    flex: 1,
  },
  completeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  modalDescription: {
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  modalFooterColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  modalCancelButton: {
    width: '100%',
  },
  whatsappButton: {
    backgroundColor: '#16a34a',
  },
  directionsButton: {
    backgroundColor: '#3b82f6',
  },
  directionsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});