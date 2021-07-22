import DateTimePicker from '@react-native-community/datetimepicker';
import Axios from 'axios';
import Moment from 'moment';
import 'moment/locale/id';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import normalize from 'react-native-normalize';
import {IcRekapData} from '../../assets';
import {Gap, HeaderDetail, Select} from '../../components';
import {useForm} from '../../utils';
import storage from '../../utils/storage';

const Pelaporan = ({navigation}) => {
  const [penugasan, setPenugasan] = useState('');
  const [label, setLabel] = useState([]);
  const [value, setValue] = useState([]);

  const [form, setForm] = useForm({
    wmp: '1',
    perbaikan: 'Pengerukan',
    from: new Date(),
    to: new Date(),
  });

  const from = Moment(form.from).format('YYYY-MM-DD');
  const to = Moment(form.to).format('YYYY-MM-DD');

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const onChangeFrom = (event, selectedDate) => {
    const currentDate = selectedDate || form.from;
    setForm('from', currentDate);
    setShowFrom(false);
  };

  const onChangeTo = (event, selectedDate) => {
    const currentDate = selectedDate || form.to;
    setForm('to', currentDate);
    setShowTo(false);
  };

  const data = {
    labels: label,
    datasets: [
      {
        data: value,
      },
    ],
  };

  const API_HOST = {
    url: 'https://berau.cbapps.co.id/api/v1',
  };

  useEffect(() => {
    storage
      .load({
        key: 'tambang',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          someFlag: true,
        },
      })
      .then(res => {
        setPenugasan(res.nama);
      })
      .catch(err => {
        console.error(err.response);
      });
  }, []);

  const onFilter = () => {
    storage
      .load({
        key: 'token',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          someFlag: true,
        },
      })
      .then(ret => {
        Axios.get(
          `${API_HOST.url}/report/perbaikan?id_wmp=${form.wmp}&tipe=${form.perbaikan}&from=${from}&to=${to}`,
          {
            headers: {
              Authorization: `Bearer ${ret}`,
            },
          },
        )
          .then(res => {
            setLabel(res.data.data_field);
            setValue(res.data.data_rows);
          })
          .catch(err => {
            console.error(err.response);
          });
      })
      .catch(err => {
        console.error(err.response);
      });
  };
  return (
    <View style={styles.page}>
      <HeaderDetail
        onPress={() => navigation.goBack()}
        company="PT. Berau Coal"
      />
      <Gap height={11} />
      <View style={styles.select}>
        <Select
          value={penugasan}
          type="Penugasan"
          onSelectChange={item => setPenugasan(item)}
          enabled={false}
        />
      </View>
      <View style={styles.containerMenu}>
        <View activeOpacity={0.7} style={styles.menu}>
          <IcRekapData />
          <Gap height={2} />
          <Text style={styles.menuText}>Pelaporan</Text>
        </View>
        <View style={styles.wmp}>
          <View style={styles.select}>
            <Select
              value={form.wmp}
              type="WMP"
              onSelectChange={item => setForm('wmp', item)}
            />
            <Select
              value={form.perbaikan}
              type="Jenis Perbaikan"
              onSelectChange={item => setForm('perbaikan', item)}
            />
          </View>
          <View style={styles.filter}>
            <TouchableOpacity
              style={styles.calendar}
              onPress={() => setShowFrom(true)}>
              <Text style={styles.textCalendar}>
                {Moment(form.from).format('DD-MM-YYYY')}
              </Text>
              {showFrom && (
                <DateTimePicker
                  testID="dateFrom"
                  value={form.from}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeFrom}
                />
              )}
            </TouchableOpacity>
            <View style={styles.to}>
              <Text>to</Text>
            </View>
            <TouchableOpacity
              style={styles.calendar}
              onPress={() => setShowTo(true)}>
              <Text style={styles.textCalendar}>
                {Moment(form.to).format('DD-MM-YYYY')}
              </Text>
              {showTo && (
                <DateTimePicker
                  testID="dateTo"
                  value={form.to}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTo}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.generate}>
            <Gap width={15} />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={onFilter}>
              <Text style={styles.text}>Generate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Content */}
      <View style={styles.chartContainer}>
        <BarChart
          style={styles.chart}
          data={data}
          width={350}
          height={320}
          fromZero={true}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.8,
          }}
          // verticalLabelRotation={30}
        />
      </View>
    </View>
  );
};

export default Pelaporan;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: normalize(20),
  },
  containerMenu: {
    flexDirection: 'row',
    paddingLeft: normalize(15),
  },
  wmp: {
    flex: 1,
  },
  select: {
    marginHorizontal: normalize(15),
  },
  menu: {
    alignItems: 'center',
    marginTop: normalize(16),
  },
  menuText: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#286090',
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(15),
    marginBottom: normalize(8),
  },
  calendar: {
    borderWidth: 1,
    paddingHorizontal: normalize(17),
    paddingVertical: normalize(6),
    borderRadius: normalize(10),
    borderColor: '#286090',
    height: normalize(40),
  },
  textCalendar: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    padding: normalize(8),
  },
  to: {
    marginHorizontal: normalize(5),
  },
  button: {
    backgroundColor: '#3BB54A',
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(6),
    borderRadius: normalize(10),
    marginLeft: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#FFFFFF',
  },
  download: {
    paddingHorizontal: normalize(60),
  },
  generate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  satuan: {
    paddingLeft: normalize(24),
    paddingTop: normalize(15),
    marginLeft: normalize(7),
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginHorizontal: normalize(10),
    marginVertical: normalize(10),
  },
});
