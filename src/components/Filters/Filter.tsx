// @ts-nocheck
import { useState } from "react";
import {
    Button, Container, Input, Label, FormText
} from "reactstrap";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

import DualRangeSlider from "../DualRangeSlider/DualRangeSlider";

const FacilitiesOptions = [
    { value: "DrinkingWater", label: "Drinking Water" },
    { value: "CCTV", label: "CCTV" },
    { value: "24HoursOpen", label: "24 Hours Open" },
    { value: "TruckParking", label: "Truck Parking" },
    {
        value: "24HoursSecurityGuardAvailable",
        label: "24 Hours Security Guard Available",
    },
    { value: "SmokeAlarm", label: "Smoke Alarm" },
    { value: "Office", label: "Office" },
    { value: "SecurityAlarm", label: "Security Alarm" },
    { value: "FireExtinguishers", label: "Fire Extinguishers" },
    { value: "DriverRestArea", label: "Driver Rest Area" },
    { value: "TrainedStaffAvailable", label: "Trained Staff Available" },
    { value: "SeparateEntrance", label: "Separate Entrance" },
    { value: "FireHydrants", label: "Fire Hydrants" },
    { value: "PowerBackup", label: "Power Backup (Generator or Inverter)" },
    { value: "ExtraFreeSpaceAvailable", label: "Extra/Free Space Available" },
    { value: "Toilet", label: "Toilet" },
    { value: "VisitorParkingAvailable", label: "Visitor Parking Available" },
    { value: "DifferentlyAbledFriendly", label: "Differently Abled Friendly" },
    {
        value: "WarehouseManagementSystems",
        label: "Warehouse Management Systems",
    },
];

const FilterPost = ({
    RentalFields,
    BasicFields,
    SpecificationFields,
    SetBasicDetails,
    SetSpecificationDetails,
    SetRentalDetails,
    handleResetRentalDetails
}) => {
    // console.clear()

    console.log(RentalFields)
    const [warehouseRentalFields, setWarehouseRentalFields] = useState([
        ...RentalFields,
    ]); //Rental Data
    const [warehouseBasicFields, setWarehouseBasicFields] = useState([
        ...BasicFields,
    ]); //Basic Data
    const [warehouseSpecificationFields, setWarehouseSpecificationFields] =
        useState([...SpecificationFields]); //Specification Data
    const [ageRange, setAgeRange] = useState({});
    const [budgetRange, setBudgetRange] = useState({});
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedBudgetTypes, setSelectedBudgetTypes] = useState([]);
    const [selectedLease, setSelectedLease] = useState([]);
    const [selectedAnnualRate, setSelectedAnnualRate] = useState("");

    const handleAnnualRateRadioChange = (value) => {
        setSelectedAnnualRate(value);
    };

    const handleAgeRangeChange = ({ min, max }) => {
        setAgeRange({ min, max });
        console.log(ageRange);
    };

    const handleBudgetRangeChange = ({ min, max }) => {
        setBudgetRange({ min, max });
        console.log(budgetRange);
    };

    const handleLeaseCheckboxChange = (type) => {
        const updatedTypes = [...selectedLease];
        const typeIndex = updatedTypes.indexOf(type);

        if (typeIndex !== -1) {
            // Type is already selected, remove it
            updatedTypes.splice(typeIndex, 1);
        } else {
            // Type is not selected, add it
            updatedTypes.push(type);
        }

        setSelectedLease(updatedTypes);
    };

    const handleTypeCheckboxChange = (type) => {
        const updatedTypes = [...selectedTypes];
        const typeIndex = updatedTypes.indexOf(type);

        if (typeIndex !== -1) {
            // Type is already selected, remove it
            updatedTypes.splice(typeIndex, 1);
        } else {
            // Type is not selected, add it
            updatedTypes.push(type);
        }

        setSelectedTypes(updatedTypes);
    };

    const filterByWarehouseId = (warehouses1, warehouses2) => {
        const mergedArray = [];
        console.log(warehouses2);
        console.log(warehouses1);
        warehouses2.forEach((wh_1) => {
            const hasMatchingId = warehouses1.some(
                (wh_2) => wh_2.wh_id === wh_1.wh_id
            );

            if (hasMatchingId) {
                mergedArray.push(wh_1);
            }
        });
        console.log(mergedArray);
        return mergedArray;
    };

    const filterWarehousesWithPhotosOnly = (warehouseList) => {
        const whList = warehouseList.filter(
            (warehouse) => warehouse.thumbnail_cid !== null && warehouse.thumbnail_cid !== 'undefined'
        );

        return whList;
    };

    const filterWarehousesTypes = (warehouses, selectedTypes) => {
        if (selectedTypes.length === 0) {
            return RentalFields;
        }

        const filteredWarehouses = warehouses.filter((warehouse) =>
            selectedTypes.includes(warehouse.wh_type)
        );
        const finalWarehouses = filterByWarehouseId(
            filteredWarehouses,
            RentalFields
        );
        console.log(finalWarehouses);
        return finalWarehouses;
    };

    const filterWarehousesByBudgetRange = (warehouseList, selectedRange) => {
        return warehouseList.filter((warehouse) => {
            const priceRanges = [
                { range: "Type A", minPrice: 1000, maxPrice: 100000 },
                { range: "Type B", minPrice: 100001, maxPrice: 300000 },
                { range: "Type C", minPrice: 300001, maxPrice: 500000 },
                { range: "Type D", minPrice: 500001, maxPrice: 1000000 },
                { range: "Type E", minPrice: 1000001, maxPrice: Infinity },
            ];

            const warehousePriceType = warehouse.wh_budget_key;

            console.log(warehousePriceType);
            if (warehousePriceType === "Type E") {
                return warehouse.price_Type >= 2000001;
            } else {
                const priceRange = priceRanges.find(
                    (range) => range.range === warehousePriceType
                );
                if (priceRange) {
                    const { minPrice, maxPrice } = priceRange;
                    return (
                        warehouse.price_Type >= minPrice && warehouse.price_Type <= maxPrice
                    );
                }
            }

            return false;
        });
    };

    const filterWarehouseByAge = (warehouses, ageRange) => {

        if (ageRange.min === 0 && ageRange.max === 0) {
            return RentalFields
        }
        const filteredWarehouses = warehouses.filter((item) => {
            // Extracting the numerical value from the "wh_age" string
            const ageValue = parseInt(item.wh_age);
            return (
                !isNaN(ageValue) && ageValue >= ageRange.min && ageValue <= ageRange.max
            );
        });

        const finalWarehouses = filterByWarehouseId(
            filteredWarehouses,
            RentalFields
        );

        return finalWarehouses;
    };

    const filterWarehousesByLeasePeriod = (warehouseList, minLeaseValue) => {
        console.log(minLeaseValue);
        return warehouseList.filter((warehouse) => {
            const whMinLease = warehouse.wh_min_lease;
            const whMaxLease = warehouse.wh_max_lease;

            return whMinLease >= minLeaseValue || whMaxLease >= minLeaseValue;
        });
    };

    const filterWarehousesByRentalIncrement = (warehouseList, selectedIncrementRate) => {
        return warehouseList.filter((warehouse) => {
            const whRentalIncrement = parseInt(warehouse.wh_rental_increment);

            if (selectedIncrementRate === 'upto 5%') {
                return Number.isInteger(whRentalIncrement) && whRentalIncrement >= 0 && whRentalIncrement <= 5;
            } else if (selectedIncrementRate === '6-10%') {
                return Number.isInteger(whRentalIncrement) && whRentalIncrement >= 6 && whRentalIncrement <= 10;
            } else if (selectedIncrementRate === 'More than 10%') {
                return Number.isInteger(whRentalIncrement) && whRentalIncrement > 10;
            }

            return warehouseList;
        });
    };

    const findCommonObjects = (array1, array2, identifier) => {
        const commonObjects = array1.filter(obj1 =>
            array2.some(obj2 => obj2[identifier] === obj1[identifier])
        );
        return commonObjects;
    }

    const handleApplyFilter = () => {

        const ageFilteredWarehouses = filterWarehouseByAge(
            SpecificationFields,
            ageRange
        );

        const typeFilteredWarehouses = filterWarehousesTypes(
            BasicFields,
            selectedTypes
        );

        const withPhotosFilterWarehouses =
            filterWarehousesWithPhotosOnly(RentalFields);

        const budgetFilteredWarehouses = filterWarehousesByBudgetRange(
            warehouseRentalFields,
            budgetRange
        );

        const filteredWarehousesByLeasePeriod = filterWarehousesByLeasePeriod(
            RentalFields,
            selectedLease
        );

        const filteredWarehousesByRentalIncrement = filterWarehousesByRentalIncrement(
            RentalFields,
            selectedAnnualRate
        );

        const findCommonObjects = (...arrays) => {

            const warehouseCounts = {};

            arrays.forEach(arr => {
                arr.forEach(warehouse => {
                    if (!warehouseCounts[warehouse.wh_id]) {
                        warehouseCounts[warehouse.wh_id] = 0;
                    }
                    warehouseCounts[warehouse.wh_id]++;
                });
            });

            const minCount = Math.min(...Object.values(warehouseCounts));

            const commonWarehouses = arrays.reduce((acc, curr) => {
                curr.forEach(warehouse => {
                    if (warehouseCounts[warehouse.wh_id] === minCount && !acc.some(w => w.wh_id === warehouse.wh_id)) {
                        acc.push(warehouse);
                    }
                });
                return acc;
            }, []);

            return commonWarehouses;

        }

        function findCommonObjects1(...arrays) {
            if (arrays.length === 0) {
                return [];
            }

            const identifier = 'wh_id'; // Change this to the property you want to use for comparison

            let commonObjects = arrays[0];

            for (let i = 1; i < arrays.length; i++) {
                const currentArray = arrays[i];

                commonObjects = commonObjects.filter(commonObj =>
                    currentArray.some(currentObj => currentObj[identifier] === commonObj[identifier])
                );

                if (commonObjects.length === 0) {
                    arrays.splice(i, 1);
                    i--;
                }
            }

            return commonObjects;
        }

        const uniqueCommonWarehouses = findCommonObjects1(
            ageFilteredWarehouses,
            withPhotosFilterWarehouses,
            filteredWarehousesByLeasePeriod,
            filteredWarehousesByRentalIncrement
        );

        console.log(uniqueCommonWarehouses.length)


        // const commonObjects = findCommonObjects(ageFilteredWarehouses, filteredWarehousesByLeasePeriod, 'wh_id');
        // console.log(commonObjects);
        console.clear();
        console.log(ageFilteredWarehouses);
        console.log(typeFilteredWarehouses);
        console.log(withPhotosFilterWarehouses);
        console.log(budgetFilteredWarehouses)
        console.log(filteredWarehousesByLeasePeriod);
        console.log(filteredWarehousesByRentalIncrement)



        SetRentalDetails(uniqueCommonWarehouses);
    };

    const handleResetFilters = () => {
        setAgeRange({});
        setSelectedTypes([]);
        setBudgetRange({});
        setSelectedLease([]);
        setSelectedBudgetTypes([])
        setSelectedAnnualRate("");
        handleResetRentalDetails()
    };
    return (
        <>
            <Container
                style={{ minHeight: "100vh" }}
                fluid={true}
                className="rounded white-bg m-6"
            >
                {/* <Row>
                    <Col xs="12" sm="6">
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret>
                                Select Filter Type
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => handleFilterChange('basic')}>Basic Filter</DropdownItem>
                                <DropdownItem onClick={() => handleFilterChange('advanced')}>Advanced Filter</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12" sm="6">
                        {selectedFilter === 'basic' && <BasicFilter />}
                        {selectedFilter === 'advanced' && <AdvancedFilter />}
                    </Col>
                </Row> */}
                <div className="pb-3">
                    <h1>Filters</h1>

                    <hr></hr>
                    {/* With Photos Only */}
                    <div>
                        <h5 className="p-2">With Photos Only</h5>
                        <div style={{ marginLeft: "20px" }}>
                            <div>
                                <Label>
                                    <Input className="m-1 p-1" type="checkbox" />
                                    Yes
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {/* Warehouse Tpye */}
                    <div>
                        <h5 className="p-2">Warehouse Type</h5>
                        <div style={{ marginLeft: "20px" }}>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleTypeCheckboxChange("Government")}
                                    />
                                    Government
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleTypeCheckboxChange("Private")}
                                    />
                                    Private
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleTypeCheckboxChange("Custom Bonded")}
                                    />
                                    Custom Bonded
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleTypeCheckboxChange("Open Land")}
                                    />
                                    Open Land
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleTypeCheckboxChange("Tarped")}
                                    />
                                    Tarped
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() =>
                                            handleTypeCheckboxChange("Others")
                                        }
                                    />
                                    Others
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {/* Property Age */}
                    <div className="mb-5 pb-2">
                        <h5 className="p-2 mb-3">Property Age</h5>
                        <div className="m-2">
                            <DualRangeSlider
                                min={0}
                                max={100}
                                onChange={({ min, max }) => {
                                    // setAgeRange({min,max})
                                    console.log(min, max);
                                    handleAgeRangeChange({ min, max });
                                }}
                            // onChange={handleRangeChange}
                            />
                        </div>
                    </div>
                    <hr></hr>
                    {/* Budget */}
                    <div className="mb-5 pb-2">
                        <h5 className="p-2">Budget</h5>
                        <FormText className="p-2 mb-3">In Rupees</FormText>
                        <div className="m-2">
                            <DualRangeSlider
                                min={1000}
                                max={10000000}
                                onChange={({ min, max }) => {
                                    console.log(min, max);
                                    handleBudgetRangeChange({ min, max });
                                }}
                            />
                        </div>
                    </div>
                    <hr></hr>
                    {/* <div>
                        <h5 className="p-2">Budget</h5>{" "}
                        <div style={{ marginLeft: "20px" }}>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleBudgetCheckboxChange("Type A")}
                                    />
                                    Type A
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleBudgetCheckboxChange("Type B")}
                                    />
                                    Type B
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleBudgetCheckboxChange("Type C")}
                                    />
                                    Type C
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleBudgetCheckboxChange("Others")}
                                    />
                                    Type D
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleBudgetCheckboxChange("Type E")}
                                    />
                                    Type E
                                </Label>
                            </div>
                        </div>
                    </div> */}
                    {/* <hr></hr> */}
                    {/* Trusted Owner */}
                    <div>
                        <h5 className="p-2">Trusted Owner</h5>
                        <div style={{ marginLeft: "20px" }}>
                            <div>
                                <Label>
                                    <Input className="m-1 p-1" type="checkbox" checked disabled />
                                    Yes
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {/* Verified Properties */}
                    <div>
                        <h5 className="p-2">Verified Properties</h5>
                        <div style={{ marginLeft: "20px" }}>
                            <div>
                                <Label>
                                    <Input className="m-1 p-1" type="checkbox" checked disabled />
                                    Yes
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {/* Lease Period */}
                    <div>
                        <h5 className="p-2">Lease Period</h5>
                        <div style={{ marginLeft: "20px" }}>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleLeaseCheckboxChange("1 month")}
                                    />
                                    1 month
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleLeaseCheckboxChange("3 months")}
                                    />
                                    3 months
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleLeaseCheckboxChange("6 months")}
                                    />
                                    6 months
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() => handleLeaseCheckboxChange("1 year")}
                                    />
                                    1 year
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="checkbox"
                                        onChange={() =>
                                            handleLeaseCheckboxChange("More then a year")
                                        }
                                    />
                                    More then a year
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {/* Annual Rate Increment */}
                    <div>
                        <h5 className="p-2">Annual Rate Increment</h5>
                        <div style={{ marginLeft: '20px' }}>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="radio"
                                        name="annualRate"
                                        checked={selectedAnnualRate === 'upto 5%'}
                                        onChange={() => handleAnnualRateRadioChange('upto 5%')}
                                    />
                                    upto 5%
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="radio"
                                        name="annualRate"
                                        checked={selectedAnnualRate === '6-10%'}
                                        onChange={() => handleAnnualRateRadioChange('6-10%')}
                                    />
                                    6-10%
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className="m-1 p-1"
                                        type="radio"
                                        name="annualRate"
                                        checked={selectedAnnualRate === 'More than 10%'}
                                        onChange={() => handleAnnualRateRadioChange('More than 10%')}
                                    />
                                    More than 10%
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div>
                        <div >
                            <div className="d-flex justify-content-center align-items-center">

                                <Button className="mt-3 mb-3 me-2" type="submit" color="info" onClick={handleResetFilters}>
                                    Reset
                                </Button>
                                <Button className="mt-3 mb-3" type="submit" color="success" onClick={handleApplyFilter}>
                                    Apply
                                </Button>

                            </div></div>
                    </div>
                    {/* Looking To */}
                    {/* <div>
                        <h5 className='p-2'>Looking To</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'

                                        type="checkbox"
                                    />
                                    Rent
                                </Label>
                            </div>

                        </div>

                    </div> */}
                    {/* Distance Range */}
                    {/* <div className='mb-5 pb-2'>
                        <h5 className='p-2 mb-3'>Distance</h5>
                        <FormText className='p-2 mb-3'>
                            In KM
                        </FormText>
                        <div className="m-2">
                            <DualRangeSlider
                                min={0}
                                max={100}
                                onChange={({ min, max }) => {
                                    // setAgeRange({min,max})
                                    console.log(min, max)
                                }}
                            />
                        </div>

                    </div> */}
                    {/* <hr></hr> */}
                    {/* Facilities */}
                    {/* <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[FacilitiesOptions[0], FacilitiesOptions[1]]}
                        isMulti
                        options={FacilitiesOptions}
                    />
                    <hr></hr> */}

                    {/* Coverage */}
                    {/* <div>
                        <h5 className='p-2'>Coverage</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Fully Covered
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Open Space
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Tarped
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Others
                                </Label>
                            </div>
                        </div>

                    </div>
                    <hr></hr> */}
                    {/* Grade */}
                    {/* <div>
                        <h5 className='p-2'>Grade</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Food
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Hazardous Material
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Industrial
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Others
                                </Label>
                            </div>
                        </div>

                    </div>
                    <hr></hr> */}
                    {/* Ventilation */}
                    {/* <div>
                        <h5 className='p-2'>Ventilation</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Sealed
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Refrigerated
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Fan(Top or Window)
                                </Label>
                            </div>
                        </div>

                    </div>
                    <hr></hr> */}

                    {/* Carpet Area Required */}
                    {/* <div className='mb-5 pb-2'>
                        <h5 className='p-2'>Carpet Area Required
                        </h5>
                        <FormText className='p-2 mb-3'>
                            In sq feet
                        </FormText>
                        <div className="m-2">

                            <DualRangeSlider
                                min={1000}
                                max={100000}
                                onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}
                            />
                        </div>

                    </div>
                    <hr></hr> */}
                    {/* Payment Duration */}
                    {/* <div>
                        <h5 className='p-2'>Payment Duration</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <FormText>
                                In sq feet
                            </FormText>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Upto 6 months
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    7 months to Year
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    More than 1 Year
                                </Label>
                            </div>
                        </div>

                    </div>
                    <hr></hr> */}

                    {/* Posted By */}
                    {/* <div>
                        <h5 className='p-2'>Posted By</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Broker
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Owner
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Company
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Availability */}
                    {/* <div>
                        <h5 className='p-2'>Availability</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Ready to Move
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Occupied/Rented
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Not Available
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* If Rented, Nearest Availability */}
                    {/* <div>
                        <h5 className='p-2'>If Rented, Nearest Availability</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Within 1 Month
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Within 6 Month
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    More then 1 Year
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Storage Layout */}
                    {/* <div>
                        <h5 className='p-2'>Storage Layout</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Ground
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Pallet
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Double Stacking
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Rooms
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Add-on Services */}
                    {/* <div>
                        <h5 className='p-2'>Add-on Services</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Repacking
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Transhipment
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Loading/Unloading Labour Available
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Equipments */}
                    {/* <div>
                        <h5 className='p-2'>Equipments</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Crane
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Forklift/Pallet Jack
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Loading Dock Leveler (Manual/Auto)
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Weigh Bridge
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Electricity Connection */}
                    {/* <div>
                        <h5 className='p-2'>Electricity Connection</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    LT  Connection
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    HT Connection (Without Transformer)
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    HT Connection (With Transformer)
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Rental Type */}
                    {/* <div>
                        <h5 className='p-2'>Rental Type</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Full Warehouse
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Part of Warehouse
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Room/Garage
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}

                    {/* Number of Doors */}
                    {/* <div>
                        <h5 className='p-2'>Number of Doors</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    0-5 doors
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    6-10 doors
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    More than 10 doors
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Facing Direction */}
                    {/* <div>
                        <h5 className='p-2'>Facing Direction</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    North
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    South
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    East
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    West
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Assurance */}
                    {/* <div>
                        <h5 className='p-2'>Assurance</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Fumigated
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Pest/Rodents Safe
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Moisture Free
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Rental Payment Terms */}
                    {/* <div>
                        <h5 className='p-2'>Rental Payment Terms</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Monthly
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Quarterly
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Bi-Annually
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'
                                        type="checkbox"
                                    />
                                    Annually
                                </Label>
                            </div>
                        </div>
                    </div>
                    <hr></hr> */}
                    {/* Rating */}
                    {/* <div>
                        <h5 className='p-2'>Rating</h5>
                        <div  >
                            <Rating
                                initialValue={5}
                                transition={true}
                                showTooltip={true}
                                allowFraction={true}
                                onClick={handleRating}
                            />

                        </div>


                    </div>
                    <hr></hr> */}
                    {/* Checks Allowed */}
                    {/* <div>
                        <h5 className='p-2'>Checks Allowed</h5>
                        <div style={{ marginLeft: "20px" }} >
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'

                                        type="checkbox"
                                    />
                                    Never
                                </Label>
                            </div>
                            <div>
                                <Label>
                                    <Input
                                        className='m-1 p-1'

                                        type="checkbox"
                                    />
                                    Periodically (in the presence of both parties)
                                </Label>
                            </div>
                        </div>

                    </div>
                    <hr></hr> */}
                </div>
            </Container>
        </>
    );
};

export default FilterPost;
