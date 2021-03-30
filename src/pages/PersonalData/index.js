import 'moment/locale/id';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {IcAddAttendance, IcEdit, IcTrash} from '../../assets';
import {Button, Gap, HeaderDetail} from '../../components';

const PersonalData = ({navigation}) => {
  return (
    <View style={styles.page}>
      <HeaderDetail
        onPress={() => navigation.goBack()}
        company="PT. Berau Coal"
      />
      <Gap height={11} />
      <View style={styles.button}>
        <Button
          text="Add"
          icon={<IcAddAttendance />}
          onPress={() => navigation.navigate('AddAttendance')}
        />
      </View>
      <View style={styles.list}>
        <Text style={styles.label}>Kehadiran</Text>
        <View style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.header}>
                <Text style={styles.labelName}>Nama</Text>
                <Text style={styles.labelBadge}>Kehadiran</Text>
                <Text style={styles.labelStatus}>Status</Text>
                <Text style={styles.labelWmp}>WMP</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.valueName}>Toto</Text>
                <View style={styles.containerBadge}>
                  <View style={styles.badge}>
                    <Text style={styles.valueBadge}>Tidak Hadir</Text>
                  </View>
                </View>
                <Text style={styles.valueStatus}>Dedicated</Text>
                <Text style={styles.valueWmp}>1 LT</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.button}>
        <Button text="Submit" />
      </View>
      <View style={styles.list}>
        <Text style={styles.label}>Daftar Anggota</Text>
        <View style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.header}>
                <Text style={styles.labelName}>Nama</Text>
                <Text style={styles.labelStatus}>Status</Text>
                <Text style={styles.labelWmp}>WMP</Text>
                <Text style={styles.labelAction}>Action</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.valueName}>Toto</Text>
                <Text style={styles.valueStatus}>Dedicated</Text>
                <Text style={styles.valueWmp}>1 LT</Text>
                <View style={styles.valueAction}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('EditAttendance')}>
                    <IcEdit />
                  </TouchableOpacity>
                  <Gap width={10} />
                  <TouchableOpacity>
                    <IcTrash />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default PersonalData;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    marginHorizontal: normalize(15),
  },
  labelDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
  },
  calendar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#286090',
    borderRadius: normalize(10),
    backgroundColor: '#FFFFFF',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    marginTop: normalize(5),
  },
  placeholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#286090',
    marginHorizontal: normalize(9),
  },
  button: {
    margin: normalize(11),
    alignItems: 'flex-end',
  },
  list: {
    marginHorizontal: normalize(15),
    marginVertical: normalize(15),
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(10),
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 10,
    padding: normalize(20),
    marginTop: normalize(11),
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#A3A3A3',
    paddingHorizontal: normalize(21),
    paddingVertical: normalize(14),
    justifyContent: 'space-between',
  },
  body: {
    flexDirection: 'row',
    paddingHorizontal: normalize(21),
    paddingVertical: normalize(14),
    justifyContent: 'space-between',
  },
  labelName: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#FFFFFF',
    width: normalize(100),
    textAlign: 'center',
    marginRight: normalize(4),
  },
  labelBadge: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#FFFFFF',
    width: normalize(100),
    textAlign: 'center',
    marginRight: normalize(4),
  },
  labelStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#FFFFFF',
    width: normalize(100),
    textAlign: 'center',
    marginRight: normalize(4),
  },
  labelWmp: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#FFFFFF',
    width: normalize(100),
    textAlign: 'center',
    marginRight: normalize(4),
  },
  labelAction: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#FFFFFF',
    width: normalize(100),
    textAlign: 'center',
    marginRight: normalize(4),
  },
  containerBadge: {
    width: normalize(100),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: normalize(-3),
  },
  badge: {
    width: normalize(70),
    backgroundColor: '#A3A3A3',
    borderRadius: normalize(5),
    paddingVertical: normalize(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueName: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
    width: normalize(100),
    marginRight: normalize(4),
    textAlign: 'center',
  },
  valueBadge: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(10),
    color: '#FFFFFF',
  },
  valueStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
    width: normalize(100),
    marginRight: normalize(4),
    textAlign: 'center',
  },
  valueWmp: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
    width: normalize(100),
    marginRight: normalize(4),
    textAlign: 'center',
  },
  valueAction: {
    flexDirection: 'row',
    width: normalize(100),
    marginRight: normalize(4),
    justifyContent: 'center',
  },
});
