import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Moment from 'moment';
import 'moment/locale/id';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import normalize from 'react-native-normalize';
import {ProgressStep, ProgressSteps} from 'react-native-progress-steps';
import {Gap, Select, TextInput} from '..';
import {findWmpDetail, showMessage, useForm} from '../../../utils';
import storage from '../../../utils/storage';

const API_HOST = {
  url: 'https://berau.cbapps.co.id/api/v1',
};

const StepsKimia = ({ wmp, dataWmp }) => {
  // Initial State
  const [form, setForm] = useForm({
    type: 'kimia',
    wmp: wmp,
    date_input: new Date(),
    periodical_input: 'Shift-1',
    time_input: new Date(),
    chemical: 'Kapur',
    purity: '',
    chemDose: '',
    chemDose_unit: 'L',
    before: '',
    before_unit: 'L',
    current: '',
    current_unit: 'L',
  });

  const [dataChemical, setDataChemical] = useState([]);
  const [prevChemical, setPrevChemical] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState(false);

  useEffect(async () => {
    try {
      const ret = await storage.load({
        key: 'token',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          someFlag: true,
        },
      });
      const res = await axios.get(`${API_HOST.url}/chemical`, {
        headers: {
          Authorization: `Bearer ${ret}`,
        },
      })

      console.log('DATA CHEMICAL: ', res.data.chemical);
      setDataChemical(res.data.chemical);
    } catch(err) {
      console.log('Error Chemical: ', err);
    }
  }, []);

  useEffect(() => {
    setForm('wmp', wmp);
  }, [wmp]);

  useEffect(() => {
    if(dataChemical[0]) {
      if(form.chemical !== prevChemical) {
        if(form.chemical === 'Kapur & Tawas') {
          let stock = {
            kapur: dataChemical.find(key => key.nama === 'Kapur')?.stok,
            tawas: dataChemical.find(key => key.nama === 'Tawas')?.stok,
          }
          setForm('reset', '', {
            chemical: form.chemical,
            chemDose: [],
            chemDose_unit: ['L', 'L'],
            before: [stock.kapur?.toString() ?? '', stock.tawas?.toString() ?? ''],
            before_unit: ['L', 'L'],
            current: [],
            current_unit: ['L', 'L'],
          });
        } else {
          let stock = dataChemical.find(key => key.nama === form.chemical)?.stok
          setForm('reset', '', {
            chemical: form.chemical,
            before: stock?.toString() ?? '',
          });
        }
        setPrevChemical(form.chemical);
        setIsValid(false);
      }
    }
  }, [form.chemical, dataChemical]);

  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleMultipleValue = (key ,index, value) => {
    let formNew = [...form[key]];
    formNew[index] = value;
    setForm(key, formNew);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.date_input;
    setForm('date_input', currentDate);
    setShow(false);
  };
  const onChangeTime = (event, selectedDate) => {
    const currentTime = selectedDate || form.time_input;
    setForm('time_input', new Date(currentTime));
    setShowTime(false);
  };

  const onNextStep1 = () => {
    if (form.purity || form.purity[0] && form.purity[1]) {
      setIsValid(true);
      setErrors(false);
    } else {
      if (!isValid) {
        setErrors(true);
      } else {
        setErrors(false);
      }
      if (errors) {
        showMessage('Data belum lengkap, Silahkan cek kembali');
      }
    }
  };

  const onNextStep2 = () => {
    if (
      form.before.length > 0 &&
      form.current.length > 0 &&
      form.chemDose.length > 0
    ) {
      setErrors(false);
    } else {
      setErrors(true);
      if (errors) {
        showMessage('Data belum lengkap, Silahkan cek kembali');
      }
    }
  };

  const onSubmit = () => {
    const day = new Date(form.time_input).getDate();
    const month = new Date(form.time_input).getMonth();
    const year = new Date(form.time_input).getFullYear();
    const hour = new Date(form.time_input).getHours();
    const minute = new Date(form.time_input).getMinutes();
    const second = new Date(form.time_input).getSeconds();
    const id = 'kimia' + day + month + year + hour + minute + second;

    let formNew = form;
    if(formNew.chemical === 'Kapur & Tawas') {
      formNew.purity = formNew.purity.toString();
      formNew.chemDose = formNew.chemDose.toString();
      formNew.chemDose_unit = formNew.chemDose_unit.toString();
      formNew.before = formNew.before.toString();
      formNew.before_unit = formNew.before_unit.toString();
      formNew.current = formNew.current.toString();
      formNew.current_unit = formNew.current_unit.toString();
    }

    storage.save({
      key: 'dataLocal',
      id: id,
      data: formNew,
    });
    showMessage('Data Berhasil disimpan ke LocalStorage', 'success');
  };

  const setSelectUnit = (chemical) => {
    if (chemical === 'Liquid') {
      return 'L';
    } else if (chemical?.includes('Kapur') || chemical?.includes('Tawas')) {
      return 'Kg';
    } else {
      return 'Dose';
    }
  }

  return (
    <View style={styles.page}>
      <ScrollView>
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
          nextBtnTextStyle={styles.nextText}
          onNext={onNextStep1}
          errors={errors}>
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
                <Text style={styles.label}>Periodical Input</Text>
              </View>
              <View style={styles.containerInput}>
                <Select
                  value={form.periodical_input}
                  type="Periodical"
                  onSelectChange={(value) => {
                    setForm('periodical_input', value);
                  }}
                />
              </View>
            </View>
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
                <Text style={styles.label}>Chemical</Text>
              </View>
              <View style={styles.containerInput}>
                <Select
                  value={form.chemical}
                  type="Chemical"
                  item={dataChemical?.map(chem => ({label: chem.nama, value: chem.nama}))}
                  onSelectChange={(value) => setForm('chemical', value)}
                />
              </View>
            </View>
            {form.chemical !== 'Kapur & Tawas' ?
              <View style={styles.container}>
                <View style={styles.containerLabel}>
                  <Text style={styles.label}>% Purity {form.chemical}</Text>
                </View>
                <View style={styles.containerInput}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Input"
                    keyboardType="number-pad"
                    value={form.purity}
                    onChangeText={(value) => setForm('purity', value)}
                  />
                </View>
              </View> :
              <>
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>% Purity Kapur</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Input"
                      keyboardType="number-pad"
                      value={form.purity[0]}
                      onChangeText={(value) => handleMultipleValue('purity', 0, value)}
                    />
                  </View>
                </View>
                <Gap height={15} />
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>% Purity Tawas</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Input"
                      keyboardType="number-pad"
                      value={form.purity[1]}
                      onChangeText={(value) => handleMultipleValue('purity', 1, value)}
                    />
                  </View>
                </View>
              </>
            }
            <Gap height={15} />
          </View>
        </ProgressStep>
        <ProgressStep
          label="Data"
          nextBtnStyle={styles.nextButton}
          nextBtnTextStyle={styles.nextText}
          previousBtnStyle={styles.previousButton}
          previousBtnTextStyle={styles.previousText}
          onNext={onNextStep2}
          errors={errors}>
          <View style={styles.content}>
            {form.chemical !== 'Kapur & Tawas' ?
              form.chemical === 'Tawas' && (
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>Chem. Dose {form.chemical}</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <View style={styles.containerTimeInput}>
                      <View style={styles.leftContainer}>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="number-pad"
                          placeholder="Input"
                          value={form.chemDose}
                          onChangeText={(value) => setForm('chemDose', value)}
                        />
                      </View>
                      <Gap width={20} />
                      <View style={styles.rightContainer}>
                        <Gap height={12} />
                        <Select
                          value={form.chemDose_unit}
                          type={setSelectUnit(form.chemical)}
                          onSelectChange={(value) =>
                            setForm('chemDose_unit', value)
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ) :
              <>
                {/* <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>Chem. Dose Kapur</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <View style={styles.containerTimeInput}>
                      <View style={styles.leftContainer}>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="number-pad"
                          placeholder="Input"
                          value={form.chemDose[0]}
                          onChangeText={(value) => handleMultipleValue('chemDose', 0, value)}
                        />
                      </View>
                      <Gap width={20} />
                      <View style={styles.rightContainer}>
                        <Gap height={12} />
                        <Select
                          value={form.chemDose_unit[0]}
                          type="Dose"
                          onSelectChange={(value) =>
                            handleMultipleValue('chemDose_unit', 0, value)
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View> */}
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>Chem. Dose Tawas</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <View style={styles.containerTimeInput}>
                      <View style={styles.leftContainer}>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="number-pad"
                          placeholder="Input"
                          value={form.chemDose[1]}
                          onChangeText={(value) => handleMultipleValue('chemDose', 1, value)}
                        />
                      </View>
                      <Gap width={20} />
                      <View style={styles.rightContainer}>
                        <Gap height={12} />
                        <Select
                          value={form.chemDose_unit[1]}
                          type={setSelectUnit(form.chemical)}
                          onSelectChange={(value) =>
                            handleMultipleValue('chemDose_unit', 1, value)
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </>
            }
            {form.chemical !== 'Kapur & Tawas' ?
              <View style={styles.container}>
                <View style={styles.containerLabel}>
                  <Text style={styles.label}>Stock {form.chemical} Shift Sebelumnya</Text>
                </View>
                <View style={styles.containerInput}>
                  <View style={styles.containerTimeInput}>
                    <View style={styles.leftContainer}>
                      <TextInput
                        style={[styles.timeInput, styles.disableInfo]}
                        keyboardType="number-pad"
                        placeholder="Input"
                        value={form.before}
                        editable={false}
                        onChangeText={(value) => setForm('before', value)}
                      />
                    </View>
                    <Gap width={20} />
                    <View style={styles.rightContainer}>
                      <Gap height={12} />
                      <Select
                        value={form.before_unit}
                        type={setSelectUnit(form.chemical)}
                        enabled={false}
                        onSelectChange={(value) => setForm('before_unit', value)}
                      />
                    </View>
                  </View>
                </View>
              </View> :
              <>
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>Stock Kapur Shift Sebelumnya</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <View style={styles.containerTimeInput}>
                      <View style={styles.leftContainer}>
                        <TextInput
                          style={[styles.timeInput, styles.disableInfo]}
                          keyboardType="number-pad"
                          placeholder="Input"
                          value={form.before[0]}
                          editable={false}
                          onChangeText={(value) => handleMultipleValue('before', 0, value)}
                        />
                      </View>
                      <Gap width={20} />
                      <View style={styles.rightContainer}>
                        <Gap height={12} />
                        <Select
                          value={form.before_unit[0]}
                          type={setSelectUnit(form.chemical)}
                          enabled={false}
                          onSelectChange={(value) => handleMultipleValue('before_unit', 0, value)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>Stock Tawas Shift Sebelumnya</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <View style={styles.containerTimeInput}>
                      <View style={styles.leftContainer}>
                        <TextInput
                          style={[styles.timeInput, styles.disableInfo]}
                          keyboardType="number-pad"
                          placeholder="Input"
                          value={form.before[1]}
                          editable={false}
                          onChangeText={(value) => handleMultipleValue('before', 1, value)}
                        />
                      </View>
                      <Gap width={20} />
                      <View style={styles.rightContainer}>
                        <Gap height={12} />
                        <Select
                          value={form.before_unit[1]}
                          type={setSelectUnit(form.chemical)}
                          enabled={false}
                          onSelectChange={(value) => handleMultipleValue('before_unit', 1, value)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </>
            }
            {form.chemical !== 'Kapur & Tawas' ?
              <View style={styles.container}>
                <View style={styles.containerLabel}>
                  <Text style={styles.label}>{form.chemical} dipakai</Text>
                </View>
                <View style={styles.containerInput}>
                  <View style={styles.containerTimeInput}>
                    <View style={styles.leftContainer}>
                      <TextInput
                        style={styles.timeInput}
                        keyboardType="number-pad"
                        placeholder="Input"
                        value={form.current}
                        onChangeText={(value) => setForm('current', value)}
                      />
                    </View>
                    <Gap width={20} />
                    <View style={styles.rightContainer}>
                      <Gap height={12} />
                      <Select
                        value={form.current_unit}
                        type={setSelectUnit(form.chemical)}
                        onSelectChange={(value) => setForm('current_unit', value)}
                      />
                    </View>
                  </View>
                </View>
              </View> :
              <>
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>Kapur dipakai</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <View style={styles.containerTimeInput}>
                      <View style={styles.leftContainer}>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="number-pad"
                          placeholder="Input"
                          value={form.current[0]}
                          onChangeText={(value) => handleMultipleValue('current', 0, value)}
                        />
                      </View>
                      <Gap width={20} />
                      <View style={styles.rightContainer}>
                        <Gap height={12} />
                        <Select
                          value={form.current_unit[0]}
                          type={setSelectUnit(form.chemical)}
                          onSelectChange={(value) => handleMultipleValue('current_unit', 0, value)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.container}>
                  <View style={styles.containerLabel}>
                    <Text style={styles.label}>Tawas dipakai</Text>
                  </View>
                  <View style={styles.containerInput}>
                    <View style={styles.containerTimeInput}>
                      <View style={styles.leftContainer}>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="number-pad"
                          placeholder="Input"
                          value={form.current[1]}
                          onChangeText={(value) => handleMultipleValue('current', 1, value)}
                        />
                      </View>
                      <Gap width={20} />
                      <View style={styles.rightContainer}>
                        <Gap height={12} />
                        <Select
                          value={form.current_unit[1]}
                          type={setSelectUnit(form.chemical)}
                          onSelectChange={(value) => handleMultipleValue('current_unit', 1, value)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </>
            }
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
                <Text style={styles.labelSummary}>WMP</Text>
                <Text style={styles.value}>{findWmpDetail(form.wmp, dataWmp)?.nama}</Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.labelSummary}>Date Input</Text>
                <Text style={styles.value}>
                  {Moment(form.date_input).format('DD-MM-YYYY')}
                </Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.labelSummary}>Periodical Input</Text>
                <Text style={styles.value}>{form.periodical_input}</Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.labelSummary}>Time Input</Text>
                <Text style={styles.value}>
                  {Moment(form.time_input).format('H:mm')}
                </Text>
              </View>
              <View style={styles.summary}>
                <Text style={styles.labelSummary}>Chemical</Text>
                <Text style={styles.value}>{form.chemical}</Text>
              </View>
              {form.chemical !== 'Kapur & Tawas' ?
                <>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>% Purity {form.chemical}</Text>
                    <Text style={styles.value}>{form.purity}</Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Chem. Dose {form.chemical}</Text>
                    <Text style={styles.value}>
                      {form.chemDose} {form.chemDose_unit}
                    </Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Stock {form.chemical} Shift Sblm</Text>
                    <Text style={styles.value}>
                      {form.before} {form.before_unit}
                    </Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>{form.chemical} dipakai</Text>
                    <Text style={styles.value}>
                      {form.current} {form.current_unit}
                    </Text>
                  </View>
                </> :
                <>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>% Purity Kapur</Text>
                    <Text style={styles.value}>{form.purity[0]}</Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>% Purity Tawas</Text>
                    <Text style={styles.value}>{form.purity[1]}</Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Chem. Dose Kapur</Text>
                    <Text style={styles.value}>
                      {form.chemDose[0]} {form.chemDose_unit[0]}
                    </Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Chem. Dose Tawas</Text>
                    <Text style={styles.value}>
                      {form.chemDose[1]} {form.chemDose_unit[1]}
                    </Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Stock Kapur Shift Sblm</Text>
                    <Text style={styles.value}>
                      {form.before[0]} {form.before_unit[0]}
                    </Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Stock Tawas Shift Sblm</Text>
                    <Text style={styles.value}>
                      {form.before[1]} {form.before_unit[1]}
                    </Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Kapur dipakai</Text>
                    <Text style={styles.value}>
                      {form.current[0]} {form.current_unit[0]}
                    </Text>
                  </View>
                  <View style={styles.summary}>
                    <Text style={styles.labelSummary}>Tawas dipakai</Text>
                    <Text style={styles.value}>
                      {form.current[1]} {form.current_unit[1]}
                    </Text>
                  </View>
                </>
              }
            </View>
          </View>
        </ProgressStep>
      </ProgressSteps>
      </ScrollView>
    </View>
  );
};

export default StepsKimia;

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
    marginRight: normalize(-18),
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
  },
  rightContainer: {
    flex: 1,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#286090',
    borderRadius: normalize(10),
    padding: normalize(8),
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#286090',
    borderRadius: normalize(10),
    padding: normalize(8),
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    marginRight: normalize(-20),
    color: '#020202'
  },
  card: {
    width: '90%',
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
  disableInfo: {
    color: '#020202',
    borderColor: '#A3A3A3',
    fontWeight: 'bold'
  }
});
