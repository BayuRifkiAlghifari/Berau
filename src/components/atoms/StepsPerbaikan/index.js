import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import 'moment/locale/id';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import {ProgressStep, ProgressSteps} from 'react-native-progress-steps';
import {Gap, Select} from '..';
import {findWmpDetail, showMessage, useForm} from '../../../utils';
import storage from '../../../utils/storage';

const StepsPerbaikan = ({ wmp, dataWmp }) => {
  // Initial State
  const [form, setForm] = useForm({
    type: 'perbaikan',
    wmp: wmp,
    date_input: new Date(),
    time_input: new Date(),
    jenis_perbaikan: 'Pengerukan',
    notif: 'Ya',
    note: '',
  });

  useEffect(() => {
    console.log('WMP: ', wmp);
    setForm('wmp', wmp);
  }, [wmp]);

  useEffect(() => {
    setForm('notif', form.jenis_perbaikan === 'Tidak ada perbaikan' ? 'Tidak' : 'Ya');
  }, [form.jenis_perbaikan]);

  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onChange = (selectedDate) => {
    const currentDate = selectedDate || form.date_input;
    setForm('date_input', currentDate);
    setShow(false);
  };
  const onChangeTime = (selectedDate) => {
    const currentTime = selectedDate || form.time_input;
    setForm('time_input', new Date(currentTime));
    setShowTime(false);
  };

  const onSubmit = () => {
    const day = new Date(form.time_input).getDate();
    const month = new Date(form.time_input).getMonth();
    const year = new Date(form.time_input).getFullYear();
    const hour = new Date(form.time_input).getHours();
    const minute = new Date(form.time_input).getMinutes();
    const second = new Date(form.time_input).getSeconds();
    const id = 'perbaikan' + day + month + year + hour + minute + second;

    storage.save({
      key: 'dataLocal',
      id: id,
      data: form,
    });
    showMessage('Data Berhasil disimpan ke LocalStorage', 'success');
  };
  return (
    <View style={styles.page}>
      <ProgressSteps
        completedProgressBarColor="#286090"
        activeStepIconColor="#286090"
        activeStepIconBorderColor="#286090"
        completedStepIconColor="#286090"
        activeLabelColor="#000000"
        activeStepNumColor="#FFFFFF"
        labelFontFamily="Poppins-Regular"
        labelFontSize={12}>
        <ProgressStep
          label="Description"
          nextBtnStyle={styles.nextButton}
          nextBtnTextStyle={styles.nextText}>
          <View style={styles.content}>
            <View style={styles.container}>
              <View style={styles.containerLabel}>
                <Gap height={10} />
                <Text style={styles.label}>Date Input</Text>
              </View>
              <TouchableOpacity
                style={styles.calendar}
                onPress={() => setShow(true)}>
                <Text>{Moment(form.date_input).format('DD-MM-YYYY')}</Text>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={form.date_input}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Gap height={20} />
            <View style={styles.container}>
              <View style={styles.containerLabel}>
                <Gap height={10} />
                <Text style={styles.label}>Time Input</Text>
              </View>
              <TouchableOpacity
                style={styles.calendar}
                onPress={() => setShowTime(true)}>
                <Text>{Moment(form.time_input).format('H:mm')}</Text>
                {showTime && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={form.time_input}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeTime}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Gap height={20} />
            <View style={styles.container}>
              <View style={styles.containerLabel}>
                <Text style={styles.label}>Jenis Perbaikan</Text>
              </View>
              <View style={styles.containerInput}>
                <Select
                  value={form.jenis_perbaikan}
                  type="Perbaikan"
                  onSelectChange={(value) => setForm('jenis_perbaikan', value)}
                />
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.containerLabel}>
                <Text style={styles.label}>Notif Info?</Text>
              </View>
              <View style={styles.containerInput}>
                <Select
                  value={form.notif}
                  type="Notif"
                  onSelectChange={(value) => setForm('notif', value)}
                />
              </View>
            </View>
            <Gap height={15} />
          </View>
        </ProgressStep>
        <ProgressStep
          label="Data"
          nextBtnStyle={styles.nextButton}
          nextBtnTextStyle={styles.nextText}
          previousBtnStyle={styles.previousButton}
          previousBtnTextStyle={styles.previousText}>
          <View style={styles.content}>
            <View>
              <Text style={styles.labelNote}>Deskripsi Kegiatan</Text>
              <TextInput
                style={styles.note}
                value={form.note}
                onChangeText={(value) => setForm('note', value)}
              />
            </View>
          </View>
        </ProgressStep>
        <ProgressStep
          label="Confirmation"
          nextBtnStyle={styles.nextButton}
          nextBtnTextStyle={styles.nextText}
          previousBtnStyle={styles.previousButton}
          previousBtnTextStyle={styles.previousText}
          onSubmit={onSubmit}>
          <View style={styles.contentSummary}>
            <View style={styles.card}>
              <View style={styles.summary}>
                <Text style={styles.label}>WMP</Text>
                <Text style={styles.value}>{findWmpDetail(form.wmp, dataWmp)?.nama}</Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.label}>Date Input</Text>
                <Text style={styles.value}>
                  {Moment(form.date_input).format('DD-MM-YYYY')}
                </Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.label}>Time Input</Text>
                <Text style={styles.value}>
                  {Moment(form.time_input).format('H:mm')}
                </Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.label}>Jenis Perbaikan</Text>
                <Text style={styles.value}>{form.jenis_perbaikan}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.summary}>
                <Text style={styles.label}>Kegiatan Perbaikan</Text>
                <Text style={styles.value}>{form.note}</Text>
              </View>
            </View>
          </View>
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

export default StepsPerbaikan;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  contentSummary: {
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#286090',
    width: normalize(100),
    height: normalize(45),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(14),
    color: '#FFFFFF',
  },
  previousButton: {
    backgroundColor: '#286090',
    width: normalize(100),
    height: normalize(45),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousText: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(14),
    color: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    marginHorizontal: normalize(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLabel: {
    flex: 2,
    justifyContent: 'center',
  },
  containerInput: {
    flex: 3,
    marginLeft: normalize(20),
  },
  calendar: {
    flex: 3,
    borderWidth: 1,
    borderColor: '#286090',
    borderRadius: normalize(10),
    backgroundColor: '#FFFFFF',
    paddingVertical: normalize(12),
    paddingLeft: normalize(11),
    marginLeft: normalize(14),
    marginRight: normalize(-19),
    marginBottom: normalize(-8),
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(12),
    color: '#000000',
  },
  datePicker: {
    width: normalize(200),
    marginLeft: normalize(10),
  },
  containerTimeInput: {
    flexDirection: 'row',
    marginLeft: normalize(12),
    marginRight: normalize(-18),
  },
  leftContainer: {
    flex: 1,
    marginLeft: normalize(-10),
  },
  rightContainer: {
    flex: 1,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#286090',
    borderRadius: normalize(10),
    padding: normalize(5),
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(10),
    shadowColor: '#020202',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 5,
    padding: normalize(20),
    marginBottom: normalize(13),
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelSummary: {
    fontFamily: 'Poppins-Medium',
    fontSize: normalize(14),
    color: '#020202',
  },
  value: {
    fontFamily: 'Poppins-Light',
    fontSize: normalize(14),
    color: '#020202',
  },
  labelNote: {
    fontFamily: 'Poppins-Medium',
    fontSize: normalize(14),
    color: '#020202',
    textAlign: 'left',
    marginHorizontal: normalize(45),
  },
  note: {
    borderWidth: 1,
    borderColor: '#286090',
    borderRadius: normalize(10),
    padding: normalize(5),
    backgroundColor: '#FFFFFF',
    marginHorizontal: normalize(45),
    marginVertical: normalize(13),
    width: '80%',
    height: normalize(200),
  },
});
