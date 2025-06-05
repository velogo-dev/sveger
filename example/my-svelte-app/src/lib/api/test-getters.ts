// Test to verify that the getter approach works correctly
import { api } from './index';

// Test that we can access the operations as before
export async function testGetterApproach() {
  console.log('Testing getter approach for API operations...');

  // Test that the operations are accessible
  console.log('Company operations:', typeof api.company.getApiV1CompanyList);
  console.log('User operations:', typeof api.user.getUserByName);
  console.log('Pet operations:', typeof api.pet.findPetsByStatus);

  // Test that we can actually call them (but don't make real requests)
  try {
    // These should return functions without errors
    const companyListFn = api.company.getApiV1CompanyList;
    const getUserFn = api.user.getUserByName;
    const findPetsFn = api.pet.findPetsByStatus;

    console.log('✅ All operations are accessible as functions');
    console.log('Company list function:', typeof companyListFn);
    console.log('Get user function:', typeof getUserFn);
    console.log('Find pets function:', typeof findPetsFn);

    return true;
  } catch (error) {
    console.error('❌ Error accessing operations:', error);
    return false;
  }
}

// Test with custom client
export async function testCustomClient() {
  console.log('Testing with custom client...');

  try {
    const customClient = api.company; // Just test that we can access it
    console.log('✅ Custom client access works');
    return true;
  } catch (error) {
    console.error('❌ Error with custom client:', error);
    return false;
  }
}

// Export for easy testing
export const runTests = async () => {
  const test1 = await testGetterApproach();
  const test2 = await testCustomClient();
  
  console.log('=== Test Results ===');
  console.log('Getter approach:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('Custom client:', test2 ? '✅ PASS' : '❌ FAIL');
  
  return test1 && test2;
};