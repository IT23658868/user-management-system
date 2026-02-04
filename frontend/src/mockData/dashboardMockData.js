/**
 * Mock data for testing the Dashboard component
 */

const getRandomRecentDate = () => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30); 
  const result = new Date(today);
  result.setDate(today.getDate() - daysAgo);
  return result.toISOString();
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString();
};

const getLastWeekDate = () => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - Math.floor(Math.random() * 7)); 
  return lastWeek.toISOString();
};

export const mockCustomers = [
  {
    id: "u1001",
    name: "Amal Perera",
    email: "amal.perera@example.com",
    phoneNumber: "071-1234567",
    nic: "892345671V",
    firstDealDate: getLastWeekDate(),
    lastDealDate: getTodayDate(),
    address: {
      houseNo: "42",
      street: "Palm Avenue",
      city: "Colombo"
    }
  },
  {
    id: "u1002",
    name: "Lakshmi Fernando",
    email: "lakshmi@example.com",
    phoneNumber: "077-9876543",
    nic: "905678123V",
    firstDealDate: getRandomRecentDate(),
    lastDealDate: getRandomRecentDate(),
    address: {
      houseNo: "15",
      street: "Beach Road",
      city: "Negombo"
    }
  },
  {
    id: "u1003",
    name: "Dinesh Kumar",
    email: "dinesh.k@example.com",
    phoneNumber: "075-5557777",
    nic: "851234567V",
    firstDealDate: getLastWeekDate(),
    lastDealDate: getTodayDate(),
    address: {
      houseNo: "78/A",
      street: "Hill Street",
      city: "Kandy"
    }
  },
  {
    id: "u1004",
    name: "Priya Dissanayake",
    email: "priya.d@example.com",
    phoneNumber: "070-3334444",
    nic: "917654321V",
    firstDealDate: getRandomRecentDate(),
    lastDealDate: getRandomRecentDate(),
    address: {
      houseNo: "23",
      street: "Temple Road",
      city: "Galle"
    }
  },
  {
    id: "u1005",
    name: "Saman Jayawardena",
    email: "saman.j@example.com",
    phoneNumber: "076-8889999",
    nic: "882233445V",
    firstDealDate: getLastWeekDate(),
    lastDealDate: getTodayDate(),
    address: {
      houseNo: "55",
      street: "Main Road",
      city: "Matara"
    }
  },
  {
    id: "u1006",
    name: "Kumari Silva",
    email: "kumari.s@example.com",
    phoneNumber: "072-2223333",
    nic: "938765432V",
    firstDealDate: getRandomRecentDate(),
    lastDealDate: null,
    address: {
      houseNo: "112",
      street: "Lake Drive",
      city: "Anuradhapura"
    }
  },
  {
    id: "u1007",
    name: "Malik Ranasinghe",
    email: "malik.r@example.com",
    phoneNumber: "078-4445555",
    nic: "866778899V",
    firstDealDate: getLastWeekDate(),
    lastDealDate: getTodayDate(),
    address: {
      houseNo: "87",
      street: "Park Avenue",
      city: "Colombo"
    }
  }
];

export const mockUsers = mockCustomers;

export const mockStaff = [
  {
    id: "s2001",
    name: "Nimal Fernando",
    role: "Manager",
    email: "nimal.f@example.com",
    phoneNumber: "071-7778888",
    nic: "862345678V",
    username: "nimal_manager",
    address: {
      houseNo: "42/B",
      street: "Station Road",
      city: "Colombo"
    }
  },
  {
    id: "s2002",
    name: "Kamala Jayasekara",
    role: "Clerk",
    email: "kamala.j@example.com",
    phoneNumber: "077-1112222",
    nic: "908765432V",
    username: "kamala_clerk",
    address: {
      houseNo: "15/C",
      street: "Temple Lane",
      city: "Kandy"
    }
  },
  {
    id: "s2003",
    name: "Ranjan Perera",
    role: "Delivery",
    email: "ranjan.p@example.com",
    phoneNumber: "075-3334444",
    nic: "874567890V",
    username: "ranjan_delivery",
    address: {
      houseNo: "7",
      street: "Sea View Road",
      city: "Galle"
    }
  },
  {
    id: "s2004",
    name: "Tharini Silva",
    role: "IT Support",
    email: "tharini.s@example.com",
    phoneNumber: "070-5556666",
    nic: "923456789V",
    username: "tharini_it",
    address: {
      houseNo: "101",
      street: "Tech Avenue",
      city: "Colombo"
    }
  },
  {
    id: "s2005",
    name: "Dilshan Rajapakse",
    role: "Admin",
    email: "dilshan.r@example.com",
    phoneNumber: "076-7778888",
    nic: "881122334V",
    username: "dilshan_admin",
    address: {
      houseNo: "22/A",
      street: "Main Street",
      city: "Matara"
    }
  }
];

export const mockApiResponses = {
  getAllUsers: {
    success: true,
    data: mockCustomers
  },
  getAllStaff: {
    success: true,
    data: mockStaff
  }
};