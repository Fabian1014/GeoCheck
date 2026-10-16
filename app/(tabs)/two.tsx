
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import locationsStyles from '../styles/locationsStyles';

type SavedLocation = {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
};

const STORAGE_KEY = '@geocheck/locations';

export default function TabTwoScreen() {
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLocations = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: SavedLocation[] = saved ? JSON.parse(saved) : [];

      setLocations(Array.isArray(parsed) ? parsed : []);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las ubicaciones.');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLocations();
    }, [loadLocations])
  );

  const deleteLocation = async (id: string) => {
    try {
      const updated = locations.filter((item) => item.id !== id);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setLocations(updated);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la ubicación.');
    }
  };

  const confirmDeleteLocation = (item: SavedLocation) => {
    Alert.alert(
      'Eliminar ubicación',
      '¿Deseas eliminar este registro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            void deleteLocation(item.id);
          },
        },
      ]
    );
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      'Eliminar todas las ubicaciones',
      'Se borrarán todos los registros guardados en GeoCheck. ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todo',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
                setLocations([]);
              } catch {
                Alert.alert('Error', 'No se pudieron eliminar las ubicaciones.');
              }
            })();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={locationsStyles.safeArea}>
      <ScrollView
        style={locationsStyles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            locationsStyles.title,
            { fontSize: 30, fontWeight: '800', textAlign: 'center' },
          ]}
        >
          Mis ubicaciones
        </Text>

        <Text
          style={[
            locationsStyles.subtitle,
            { textAlign: 'center', marginBottom: 20 },
          ]}
        >
          Consulta y administra tus lugares registrados.
        </Text>

        <View style={[locationsStyles.card, { marginBottom: 14 }]}>
          <Text style={[locationsStyles.cardTitle, { fontSize: 20 }]}>
            Historial guardado
          </Text>
          <Text style={locationsStyles.description}>
            {locations.length}{' '}
            {locations.length === 1
              ? 'ubicación registrada'
              : 'ubicaciones registradas'}
          </Text>
        </View>

        {loading ? (
          <View style={locationsStyles.card}>
            <Text style={locationsStyles.description}>
              Cargando ubicaciones...
            </Text>
          </View>
        ) : locations.length === 0 ? (
          <View style={locationsStyles.card}>
            <View style={locationsStyles.emptyState}>
              <Text style={locationsStyles.emptyIcon}>📍</Text>
              <Text style={locationsStyles.emptyTitle}>
                Todavía no tienes ubicaciones
              </Text>
              <Text style={locationsStyles.emptyText}>
                Registra una ubicación desde Inicio y aparecerá aquí.
              </Text>
            </View>
          </View>
        ) : (
          <>
            {locations.map((item, index) => (
              <View
                key={item.id}
                style={[locationsStyles.card, { marginBottom: 14 }]}
              >
                <Text style={[locationsStyles.cardTitle, { fontSize: 18 }]}>
                  📍 Ubicación {index + 1}
                </Text>

                <Text style={locationsStyles.description}>
                  Latitud: {item.latitude.toFixed(6)}
                </Text>
                <Text style={locationsStyles.description}>
                  Longitud: {item.longitude.toFixed(6)}
                </Text>
                <Text style={locationsStyles.description}>
                  Fecha: {item.date}
                </Text>

                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => confirmDeleteLocation(item)}
                  style={{
                    backgroundColor: '#FEE2E2',
                    padding: 12,
                    borderRadius: 12,
                    marginTop: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#B91C1C',
                      fontSize: 15,
                      fontWeight: '700',
                    }}
                  >
                    🗑 Eliminar ubicación
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              accessibilityRole="button"
              onPress={confirmDeleteAll}
              style={{
                backgroundColor: '#B91C1C',
                padding: 15,
                borderRadius: 14,
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '800',
                }}
              >
                Eliminar todas las ubicaciones
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
