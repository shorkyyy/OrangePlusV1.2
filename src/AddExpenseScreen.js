import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';
import ErrorModal from './ErrorModal'; // Import the ErrorModal component
import * as Haptics from 'expo-haptics';

const AddExpenseScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('Mua Sắm');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getCurrentDate()); // Set the default value to the current date
  const [errorMessage, setErrorMessage] = useState('');


  const route = useRoute();
  
  const [errorModalVisible, setErrorModalVisible] = useState(false); // State to control the visibility of the error modal
  
  const [isDateEditable, setIsDateEditable] = useState(false);
  // Function to enable the date input for editing
  const handleEditDate = () => {
    setIsDateEditable(true);
  };
  
  // Define the list of available descriptions for the dropdown
  const availableDescriptions = [
    'Mua Sắm',     
    'Mua Hàng Online',    
    'Ăn Uống',           
    'Thú Cưng',       
    'Khác'    ,         
    // Thêm các tùy chọn khác tùy ý...
  ];

  // Format the amount input as "50.000" when typing "50000"
  const formatAmountInput = (text) => {
    const formattedText = text.replace(/\D/g, ''); // Remove all non-numeric characters
    setAmount(formattedText.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')); // Add thousands separators
  };

  const handleAddExpense = async () => {
    // Format the amount input as "50.000" when typing "50000" before validation
    const formattedAmount = amount.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  
    // Split the date into year, month, and day
    const [year, month, day] = date.split('-').map(Number);
  
    let errorMessage = '';
  
    // Check for blank inputs
    if (!title.trim() || !description || !formattedAmount || !date) {
      errorMessage = 'Vui lòng điền đầy đủ thông tin.';
    }
  
    // Check if the title is too long
    if (!errorMessage && title.length > 15) {
      errorMessage = 'Tên chi tiêu quá dài, hãy giảm độ dài xuống dưới 15 ký tự.';
    }
  
    // Check if the date is valid based on the year, month, and day values
    const isValidDate = (year >= 1000 && year <= 9999) && (month >= 1 && month <= 12) && (day >= 1 && day <= new Date(year, month, 0).getDate());
    
    if (!errorMessage && !isValidDate) {
      errorMessage = 'Ngày không hợp lệ.';
    }
  
    // Check if the amount is valid (greater than 500)
    if (!errorMessage && parseFloat(formattedAmount.replace(/\./g, '')) < 500) {
      errorMessage = 'Số tiền phải lớn hơn 500đ.';
    }
  
    if (errorMessage) {
      // Set the error message in the state
      setErrorMessage(errorMessage);
      // Display the error modal with the appropriate error message
      setErrorModalVisible(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }
  
    const newExpense = {
      id: Math.random().toString(),
      title,
      description,
      amount: parseFloat(formattedAmount.replace(/\./g, '')), // Remove thousands separators before saving
      date,
    };
    try {
      // Save the new expense to local storage
      const savedExpenses = await AsyncStorage.getItem('expensesData');
      let updatedExpensesData = [];
      if (savedExpenses) {
        updatedExpensesData = JSON.parse(savedExpenses);
      }
      updatedExpensesData.push(newExpense);
      await AsyncStorage.setItem('expensesData', JSON.stringify(updatedExpensesData));
  
      // Call the callback function to update the expensesData in MainScreen
      const { handleAddNewExpense } = route.params;
      handleAddNewExpense(newExpense);
      navigation.goBack();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error saving new expense:', error);
    }
  };  
  
  
  // Function to get the current date in 'YYYY-MM-DD' format
  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    // return ` ${day}/${month}/${year}`;
  }

  // Function to format the amount with "." as a thousand separator and add "đ" for VND
  function formatAmount(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
  }

  // Function to clear the input fields
  const clearInput = (field) => {
    switch (field) {
      case 'title':
        setTitle('');
        break;
      case 'amount':
        setAmount('');
        break;
      case 'date':
        setDate(getCurrentDate());
        break;
      default:
        break;
    }
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSelectOption = (option) => {
    setDescription(option);
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    // Reset the state when the component is focused
    const resetState = navigation.addListener('focus', () => {
      setTitle('');
      setDescription('Mua Sắm');
      setAmount('');
      setDate(getCurrentDate());
    });

    // Clean up the listener when the component is unmounted
    return resetState;
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      {/* Icon above the title */}
      <View style={styles.iconContainer}>
      <Icon name="leaf" size={30} color="#fff" style={styles.iconAboveTitle} />
      </View>
      <Text style={styles.title}>Thông tin chi tiêu</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Tên chi tiêu"
          placeholderTextColor="#aaa"
        />
        {title !== '' && (
          <TouchableOpacity onPress={() => clearInput('title')}>
            <Icon name="times-circle" size={18} color="#ccc" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
      <TouchableOpacity style={{ flex: 1 }} onPress={toggleDropdown}>
          <ModalDropdown
            options={availableDescriptions}
            defaultIndex = {0}
            isFullWidth = {true}
            defaultValue={description}
            onSelect={(index, value) => handleSelectOption(value)}
            onDropdownWillShow={toggleDropdown}
            onDropdownWillHide={toggleDropdown}
            textStyle={styles.customDropdownButtonText}
            dropdownStyle={styles.customDropdownOptions}
            dropdownTextStyle={styles.customDropdownOptionText}
            dropdownTextHighlightStyle={styles.customDropdownHighLightStyle}
            showsVerticalScrollIndicator={false}
            renderSeparator={() => <View style={styles.dropdownSeparator} />}
          />
          <Icon name="chevron-down" size={15} color="#ccc" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        <View style={styles.amountInputContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={formatAmountInput}
            placeholder="Số tiền"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />
         <Text style={styles.currencyText}>đ</Text>
          {amount !== '' && (
            <TouchableOpacity onPress={() => clearInput('amount')}>
              <Icon name="times-circle" size={18} color="#ccc" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.inputContainer, isDateEditable && styles.editableInputContainer]}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={date}
          onChangeText={setDate}
          placeholder="Vào ngày (YYYY-MM-DD)"
          placeholderTextColor="#aaa"
          editable={isDateEditable} // Set the editable property based on the state
        />
        {!isDateEditable && (
          <TouchableOpacity onPress={handleEditDate}>
            <Icon name="edit" size={18} color="#ccc" style={styles.editIcon} />
          </TouchableOpacity>
        )}
        {isDateEditable && date !== getCurrentDate() && (
          <TouchableOpacity onPress={() => clearInput('date')}>
            <Icon name="times-circle" size={18} color="#ccc" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
      <ErrorModal isVisible={errorModalVisible} 
                  errorMessage={errorMessage} 
                  onCancel={() => setErrorModalVisible(false)} 
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
      < FontAwesome5 name="plus-circle" size={18} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.addButtonText}>Thêm mới</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8FCB8F',
    marginBottom: 35,
    textAlign: 'center',
  },
  iconAboveTitle: {
    alignSelf: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#8FCB8F',
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  editableInputContainer: {
    borderColor: '#8FCB8F', // Change the border color when editable
    backgroundColor: '#fff', // Optionally change the background color
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  customDropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  customDropdownOptions: {
    width: 325,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  customDropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  customDropdownHighLightStyle: {
    color: '#8FCB8F',
  },
  dropdownSeparator: {
    backgroundColor: '#fff',
  },
  arrowIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  clearIcon: {
    marginLeft: 10,
  },
  editIcon: {
  },
  addButton: {
    backgroundColor: '#8FCB8F',
    borderRadius: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  amountContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  currencyText: {
    fontSize: 18,
    color: '#333',
    
  },
});

export default AddExpenseScreen;
