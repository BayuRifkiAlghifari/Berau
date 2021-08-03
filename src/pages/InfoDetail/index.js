import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import normalize from 'react-native-normalize';
import {IcTrash} from '../../assets';
import {Gap, Header, Select} from '../../components';
import storage from '../../utils/storage';

const API_HOST = {
  url: 'https://berau.cbapps.co.id/api/v1',
};

const InfoDetail = ({route}) => {

  const [data, setData] = useState(route.params);
  const [me, setMe] = useState(null);
  const [status, setStatus] = useState({
    isLoading: false,
  })

  useEffect(() => {
    storage.load({
      key: 'profile',
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        someFlag: true,
      },
    }).then(ret => {
      setMe(ret);
    }).catch(err => console.log(err));
  }, []);

  useEffect(() => {
    console.log('PARAMS: ', route.params);
    setData(route.params);
  }, [route.params]);

  const handleStatusChange = (value) => (
    Alert.alert(
      "Status Perbaikan",
      `Apakah anda yakin untuk mengubah status perbaikan menjadi ${value}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => onEditStatus(value),
        }
      ]
    )
  )

  const onEditStatus = async (value) => {
    setStatus({isLoading: true});
    try {
      const ret = await storage.load({
        key: 'token',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          someFlag: true,
        },
      });
      await axios.put(
        `${API_HOST.url}/perbaikan-close/${data.id}`, {},
        {
          headers: {
            Authorization: `Bearer ${ret}`,
          },
        }
      );
      setData({...data, status_notif: value});
    } catch(err) {
      console.log('FETCH ERR: ', err);
    }
    setStatus({isLoading: false});
  }

  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{data.keterangan}</Text>
          <Gap height={25} />
          {(data && me) && (
            <View>
              <View style={styles.content}>
                <Text style={styles.label}>WMP</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{data.id_wmp}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.label}>Tanggal Perbaikan</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{moment(new Date(data.tanggal_input)).format('DD-MM-YYYY')}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.label}>Waktu Perbaikan</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{moment(new Date(data.waktu_input)).format('HH.mm')}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.label}>Jenis Perbaikan</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{data.jenis_perbaikan}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.label}>Kegiatan Perbaikan</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={[styles.value, {color: 'red'}]}>{data.keterangan}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.colon}>:</Text>
                {data.user.id === me.id ?
                  <View style={styles.value}>
                    {!status.isLoading ?
                      <Select
                        value={data.status_notif}
                        type="Status Perbaikan"
                        enabled={data.status_notif.toLowerCase() !== 'close' ? true : false}
                        onSelectChange={(value) => handleStatusChange(value)}
                      /> : <ActivityIndicator size="small" color="'#286090" />
                    }
                  </View> :
                  <Text style={[styles.value, {color: 'red'}]}>{data.status_notif}</Text>
                }
              </View>
            </View>
          )}
        </View>
        <Gap height={11} />
        {/* <View style={styles.button}>
          <IcTrash />
          <Gap width={10} />
          <Text style={styles.text}>Hapus</Text>
        </View> */}
      </View>
    </View>
  );
};

export default InfoDetail;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: normalize(-20),
    borderTopLeftRadius: normalize(25),
    borderTopRightRadius: normalize(25),
    paddingVertical: normalize(25),
    paddingHorizontal: normalize(15),
  },
  card: {
    flex: 1,
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
    paddingHorizontal: normalize(35),
    paddingVertical: normalize(30),
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(14),
    color: '#286090',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(4)
  },
  label: {
    flex: 3,
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(14),
    color: '#000000',
  },
  value: {
    flex: 4,
    fontFamily: 'Poppins-Medium',
    fontSize: normalize(14),
    color: '#000000',
  },
  button: {
    backgroundColor: '#286090',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(10),
    borderRadius: normalize(10),
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  colon: {
    fontFamily: 'Poppins-Medium',
    fontSize: normalize(14),
    color: '#000000',
    paddingHorizontal: normalize(16)
  }
});
