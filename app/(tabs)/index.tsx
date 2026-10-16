import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import homeStyles from '../styles/homeStyles';

type SavedLocation = {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
};

export default function HomeScreen() {
  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);

  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    Accelerometer.setUpdateInterval(500);

    const subscription = Accelerometer.addListener((data) => {
      setAcceleration(data);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getLocation = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permiso necesario',
          'Debes permitir el acceso a la ubicación para utilizar GeoCheck.'
        );
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      setLocation(currentLocation);

      const newLocation: SavedLocation = {
        id: Date.now().toString(),
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        date: new Date().toLocaleString(),
      };

      const existingLocations =
        await AsyncStorage.getItem('@geocheck/locations');

      const savedLocations: SavedLocation[] = existingLocations
        ? JSON.parse(existingLocations)
        : [];

      const updatedLocations = [
        newLocation,
        ...savedLocations,
      ];

      await AsyncStorage.setItem(
        '@geocheck/locations',
        JSON.stringify(updatedLocations)
      );

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      Alert.alert(
        'Ubicación guardada',
        'Tu ubicación se registró correctamente. Puedes consultarla en Mis ubicaciones.'
      );
    } catch (error) {
      console.error('Error al obtener o guardar la ubicación:', error);

      Alert.alert(
        'Error',
        'No fue posible obtener o guardar la ubicación. Inténtalo nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={homeStyles.safeArea}>
      <View style={homeStyles.container}>
        <Text style={homeStyles.title}>GeoCheck</Text>

        <Text style={homeStyles.subtitle}>
          Registro y control de ubicaciones
        </Text>

        <View style={homeStyles.card}>
          <Text style={homeStyles.cardTitle}>
            Mi ubicación actual
          </Text>

          <Text style={homeStyles.description}>
            Obtén las coordenadas GPS de tu dispositivo y guárdalas para consultarlas después.
          </Text>

          {location ? (
            <View style={homeStyles.locationContainer}>
              <Text style={homeStyles.coordinateLabel}>
                Latitud
              </Text>
              <Text style={homeStyles.coordinateValue}>
                {location.coords.latitude.toFixed(6)}
              </Text>

              <Text style={homeStyles.coordinateLabel}>
                Longitud
              </Text>
              <Text style={homeStyles.coordinateValue}>
                {location.coords.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <View style={homeStyles.emptyState}>
              <Text style={homeStyles.emptyIcon}>📍</Text>
              <Text style={homeStyles.emptyText}>
                Todavía no has consultado tu ubicación.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              homeStyles.button,
              loading && homeStyles.buttonDisabled,
            ]}
            onPress={getLocation}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={homeStyles.buttonText}>
                Obtener y guardar ubicación
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: 18,
            marginTop: 24,
            marginBottom: 16,
            elevation: 2,
          }}
        >
          <Text style={homeStyles.cardTitle}>
            Acelerómetro del dispositivo
          </Text>

          <Text style={homeStyles.description}>
            Mueve o inclina tu celular para observar los cambios en los tres ejes.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 18,
            }}
          >
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#64748B', fontWeight: '600' }}>
                Eje X
              </Text>
              <Text style={{ color: '#2563EB', fontSize: 22, fontWeight: '800' }}>
                {acceleration.x.toFixed(2)}
              </Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#64748B', fontWeight: '600' }}>
                Eje Y
              </Text>
              <Text style={{ color: '#2563EB', fontSize: 22, fontWeight: '800' }}>
                {acceleration.y.toFixed(2)}
              </Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#64748B', fontWeight: '600' }}>
                Eje Z
              </Text>
              <Text style={{ color: '#2563EB', fontSize: 22, fontWeight: '800' }}>
                {acceleration.z.toFixed(2)}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: '#64748B',
              fontSize: 12,
              marginTop: 14,
              textAlign: 'center',
            }}
          >
            Valores aproximados en unidades de gravedad (g)
          </Text>
        </View>

        <View style={homeStyles.infoCard}>
          <Text style={homeStyles.infoTitle}>
            Información del dispositivo
          </Text>

          <Text style={homeStyles.infoText}>
            Plataforma: {Platform.OS}
          </Text>

          <Text style={homeStyles.infoText}>
            GPS, almacenamiento y sensor de movimiento
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}