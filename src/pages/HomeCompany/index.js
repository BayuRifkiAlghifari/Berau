import Axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {Row, Table} from 'react-native-table-component';
import {
  Company,
  IcBack,
  IcBackHome,
  IcHistory,
  IcLaporan,
  IcPenugasan,
  IcPersonalData,
  IcSinkron,
} from '../../assets';
import {Gap, HeaderCompany} from '../../components';
import storage from '../../utils/storage';

const HomeCompany = ({navigation}) => {
  const [penugasan, setPenugasan] = useState('');
  const [data, setData] = useState([]);
  const [tableHead] = useState(['Bulan', 'Total Kapur', 'Total Tawas']);
  const [widthArr, setWidthArr] = useState([110, 110, 110]);
  const [summary, setSummary] = useState({
    wmp: 0,
    material: 0,
    inspeksi: 0,
  });
  const tableData = data;

  const API_HOST = {
    url: 'https://berau.cbapps.co.id/api/v1',
  };

  useEffect(async () => {
    storage
    .load({
      key: 'tambang',
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        someFlag: true,
      },
    })
    .then((res) => {
      setPenugasan(res.nama);
    })
    .catch((err) => {
      console.error(err.response);
    });
    const ret = await storage
      .load({
        key: 'token',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          someFlag: true,
        },
      })
    const res = await Axios.get(`${API_HOST.url}/report/rekaptulasi`, {
      headers: {
        Authorization: `Bearer ${ret}`,
      },
    });
    setData(res.data.data_rows);
    setWidthArr(res.data.data_width);

    const wmp = await getPerformanceSummary('lewat-baku-mutu', ret);
    const material = await getPerformanceSummary('pemakaian-material', ret);
    const inspeksi = await getPerformanceSummary('perbaikan-open', ret);
    
    setSummary({
      wmp: wmp.data.count,
      material: material.data.count,
      inspeksi: inspeksi.data.count,
    })
  }, []);

  const getPerformanceSummary = (type, token) => {
    return Axios.get(`${API_HOST.url}/info/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.button}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}>
              <IcBack />
            </TouchableOpacity>
            <Gap width={20} />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MainApp')}>
              <IcBackHome />
            </TouchableOpacity>
          </View>
          <HeaderCompany
            onPress={() => navigation.navigate('ProfileCompany')}
            title="PT BERAU COAL"
            address="Jl. Pemuda, No. 40, Tanjungredeb, Tj. Redeb, Berau, Kabupaten Berau, Kalimantan Timur 77311"
            phone="(0554) 23400"
            profile={Company}
          />
        </View>
        <View style={styles.containerMenu}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.menu}
            onPress={() => navigation.navigate('PersonalData')}>
            <IcPersonalData />
            <Text style={styles.menuText}>Absensi Anggota</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.menu}
            onPress={() => navigation.navigate('Penugasan')}>
            <IcPenugasan />
            <Text style={styles.menuText}>Penugasan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.menu}
            onPress={() => navigation.navigate('ChooseReport')}>
            <IcLaporan />
            <Text style={styles.menuText}>Pelaporan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.menu}
            onPress={() => navigation.navigate('History')}>
            <IcHistory />
            <Text style={styles.menuText}>History</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>Rekapitulasi Data Tahun Berjalan</Text>
          <Text style={styles.location}>Lokasi : {penugasan}</Text>
          <View style={styles.table}>
            {/* Table */}
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={styles.borderThead}>
                  <Row
                    data={tableHead}
                    widthArr={widthArr}
                    style={styles.thead}
                    textStyle={styles.theadText}
                  />
                </Table>
                <ScrollView>
                  <Table borderStyle={styles.borderThead}>
                    {tableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={widthArr}
                        style={[
                          styles.row,
                          index % 2 && {backgroundColor: '#CCCC'},
                        ]}
                        textStyle={styles.text}
                      />
                    ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={styles.containerFooter}>
          <Text style={styles.text}>Performance Summary</Text>
          <Gap height={5} />
          <View style={styles.footer}>
            <View style={styles.footerCard}>
              <Text style={styles.footerText}>WMP Lewat Baku Mutu</Text>
              <Text style={styles.footerCount}>{summary.wmp}</Text>
            </View>
            <View style={styles.footerCard}>
              <Text style={styles.footerText}>Pemakaian Material</Text>
              <Text style={styles.footerCount}>{summary.material}</Text>
            </View>
            <View style={styles.footerCard}>
              <Text style={styles.footerText}>Total Inspeksi</Text>
              <Text style={styles.footerText}>Open</Text>
              <Text style={styles.footerCount}>{summary.inspeksi}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeCompany;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingVertical: normalize(24),
    paddingHorizontal: normalize(20),
    backgroundColor: '#286090',
  },
  button: {
    flexDirection: 'row',
    marginBottom: normalize(13),
  },
  containerMenu: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(10),
    shadowColor: '#020202',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: normalize(10),
    padding: normalize(20),
    marginHorizontal: normalize(15),
    marginTop: normalize(11),
    justifyContent: 'space-between',
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#286090',
  },
  content: {
    height: normalize(330),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(10),
    shadowColor: '#020202',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: normalize(10),
    padding: normalize(20),
    marginHorizontal: normalize(15),
    marginTop: normalize(11),
  },
  table: {
    flex: 1,
    marginTop: normalize(11),
    justifyContent: 'center',
    alignItems: 'center',
  },
  thead: {
    height: normalize(50),
    backgroundColor: '#4472C4',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
    textAlign: 'center',
  },
  borderThead: {
    borderWidth: 1,
    borderColor: '#FFF',
  },
  row: {height: normalize(40), backgroundColor: '#E7E6E1'},
  theadText: {
    fontFamily: 'Poppins-Bold',
    fontSize: normalize(12),
    color: '#FFF',
    textAlign: 'center',
  },
  location: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
  },
  containerFooter: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(10),
    shadowColor: '#020202',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: normalize(10),
    padding: normalize(20),
    marginHorizontal: normalize(15),
    marginTop: normalize(11),
    marginBottom: normalize(20),
  },
  footer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerCard: {
    backgroundColor: '#FF3A3A',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(5),
    width: normalize(70),
    height: normalize(60),
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(10),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footerCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(14),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8
  },
});
