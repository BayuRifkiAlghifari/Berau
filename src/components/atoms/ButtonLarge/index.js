import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import normalize from 'react-native-normalize'

const ButtonLarge = ({ text, icon, color, textColor, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, color && {backgroundColor: color}]} 
      onPress={onPress}
    >
      {
        icon && (
          <View style={styles.icon}>
            {icon}
          </View>
        )
      }
      <Text style={[styles.text, textColor && {color: textColor}]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default ButtonLarge

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#286090',
    paddingHorizontal: normalize(36),
    paddingVertical: normalize(14),
    borderRadius: normalize(10),
    flexDirection: 'row'
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#ffff',
    fontSize: normalize(18)
  },
  icon: {
    marginRight: 8
  }
})
