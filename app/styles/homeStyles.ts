import { StyleSheet } from 'react-native';

const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 35,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 5,
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0F172A',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
    marginTop: 9,
    marginBottom: 24,
  },
  coordinates: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
  },
  coordinateLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  coordinateValue: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: 3,
  },
  accuracy: {
    fontSize: 12,
    color: '#475569',
    marginTop: 12,
  },
  placeholder: {
    color: '#64748B',
    paddingVertical: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 20,
    padding: 18,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
  },
  infoTitle: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoText: {
    color: '#1E40AF',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  platform: {
    color: '#1E40AF',
    fontSize: 12,
    marginTop: 12,
    fontWeight: '600',
  },
});

export default homeStyles;