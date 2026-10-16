import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import locationsStyles from '../styles/locationsStyles';

type Evidence = {
  id: string;
  uri: string;
  date: string;
};

const STORAGE_KEY = '@geocheck/evidence';

export default function EvidenciasScreen() {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvidences();
  }, []);

  const loadEvidences = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      setEvidences(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error('Error al cargar evidencias:', error);
      Alert.alert('Error', 'No fue posible cargar las fotografías guardadas.');
    }
  };

  const takePhoto = async () => {
    try {
      setLoading(true);

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso necesario',
          'Debes permitir el acceso a la cámara para tomar evidencias.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const photo = result.assets[0];

      const newEvidence: Evidence = {
        id: Date.now().toString(),
        uri: photo.uri,
        date: new Date().toLocaleString(),
      };

      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const previous: Evidence[] = saved ? JSON.parse(saved) : [];
      const updated = [newEvidence, ...previous];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEvidences(updated);

      Alert.alert('Evidencia guardada', 'La fotografía se guardó correctamente.');
    } catch (error) {
      console.error('Error al tomar la fotografía:', error);
      Alert.alert('Error', 'No se pudo tomar o guardar la fotografía.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (evidence: Evidence) => {
    Alert.alert(
      'Eliminar fotografía',
      '¿Estás seguro de que deseas eliminar esta evidencia de GeoCheck?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteEvidence(evidence.id),
        },
      ]
    );
  };

  const deleteEvidence = async (id: string) => {
    try {
      const updated = evidences.filter((item) => item.id !== id);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEvidences(updated);

      Alert.alert('Evidencia eliminada', 'La fotografía se quitó de GeoCheck.');
    } catch (error) {
      console.error('Error al eliminar evidencia:', error);
      Alert.alert('Error', 'No fue posible eliminar la fotografía.');
    }
  };

  return (
    <SafeAreaView style={locationsStyles.safeArea}>
      <ScrollView contentContainerStyle={locationsStyles.container}>
        <Text style={locationsStyles.title}>Evidencias</Text>

        <Text style={locationsStyles.subtitle}>
          Captura, consulta y administra tus fotografías.
        </Text>

        <View style={locationsStyles.card}>
          <Text style={locationsStyles.cardTitle}>
            Cámara del dispositivo
          </Text>

          <Text style={locationsStyles.description}>
            Toma una fotografía para registrar una evidencia en GeoCheck.
          </Text>

          <TouchableOpacity
            onPress={takePhoto}
            disabled={loading}
            activeOpacity={0.8}
            style={{
              backgroundColor: loading ? '#94A3B8' : '#2563EB',
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 18,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                📷 Tomar fotografía
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={locationsStyles.cardTitle}>
          Mis evidencias ({evidences.length})
        </Text>

        {evidences.length === 0 ? (
          <View style={locationsStyles.card}>
            <View style={locationsStyles.emptyState}>
              <Text style={locationsStyles.emptyIcon}>📸</Text>
              <Text style={locationsStyles.emptyTitle}>
                Todavía no tienes evidencias
              </Text>
              <Text style={locationsStyles.emptyText}>
                Las fotografías que captures aparecerán aquí.
              </Text>
            </View>
          </View>
        ) : (
          evidences.map((item) => (
            <View key={item.id} style={locationsStyles.card}>
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: '100%',
                  height: 220,
                  borderRadius: 12,
                  backgroundColor: '#E2E8F0',
                }}
                resizeMode="cover"
              />

              <Text style={locationsStyles.description}>
                Fecha: {item.date}
              </Text>

              <TouchableOpacity
                onPress={() => confirmDelete(item)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#FEE2E2',
                  padding: 13,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: '#FECACA',
                }}
              >
                <Text style={{ color: '#B91C1C', fontWeight: '700' }}>
                  🗑 Eliminar fotografía
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}