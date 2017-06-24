// import React from 'react';
// import ReactDOM from 'react-dom';

// import FormDateContainer from '../components/GitDate/FormDateContainer';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<FormDateContainer />, div);
// });

// import React from "react";
// import { shallow } from "enzyme";
// import assert from "assert";
// import FormDateContainer from '../components/GitDate/FormDateContainer';

// // unit tests for the FormDateContainer component
// describe('FormDateContainer component', () => {
//   describe('render()', () => {
//     it('should render the component', () => {
//       const wrapper = shallow(<FormDateContainer/>);
//       assert.equal(wrapper.length, 1);
//     });
//   });
// });

// import React from 'react';
// import { expect } from 'chai';
// import { shallow } from 'enzyme';
// import sinon from 'sinon';

// import FormDateContainer from '../components/GitDate/FormDateContainer';

// describe('<FormDateContainer />', () => {
//   // it('renders three <FormDateContainer /> components', () => {
//   //   const wrapper = shallow(<FormDateContainer />);
//   //   expect(wrapper.find(FormDateContainer)).to.have.length(1);
//   // });

//   it('renders an `.show-grid`', () => {
//     const wrapper = shallow(<FormDateContainer />);
//     expect(wrapper.find('.show-grid')).to.have.length(1);
//   });

//   // it('renders children when passed in', () => {
//   //   const wrapper = shallow(
//   //     <FormDateContainer>
//   //       <div className="unique" />
//   //     </FormDateContainer>
//   //   );
//   //   expect(wrapper.contains(<div className="unique" />)).to.equal(true);
//   // });

//   it('simulates click events', () => {
//     const onButtonClick = sinon.spy();
//     const wrapper = shallow(
//       <FormDateContainer onButtonClick={onButtonClick} />
//     );
//     wrapper.find('button').simulate('click');
//     expect(onButtonClick).to.have.property('callCount', 1);
//   });
// });

import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import FormDateContainer from '../components/GitDate/FormDateContainer'
import FormDate from '../components/GitDate/FormDate'

// it('renders correctly', () => {
//   const tree = renderer.create(
//     // <Link page="http://www.facebook.com">Facebook</Link>
//     <FormDateContainer />
//   ).toJSON();
//   expect(tree).toMatchSnapshot();
// });

// Can wrap Tests in either [test] or [it]

const overrideObj = {
    fid: 0,
    date: '20170621'
}

// [describe] Optional - For logical grouping

describe('FormDateContainer:', () => {

    test('Jest Snapshot', () => {
      const component = renderer.create(
        <FormDateContainer formParams={overrideObj} />
      )
      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<FormDateContainer formParams={overrideObj} />, div)
    })

    // Template below based on (a useful and helpful article):
        // https://medium.freecodecamp.com/the-right-way-to-test-react-components-548a4736ab22
        // https://medium.freecodecamp.com/@suchipi | Stephen Scott

        let props
        let mountedFormDateContainer
        const formDateContainer = () => {
            if (!mountedFormDateContainer) {
                mountedFormDateContainer = mount(
                    <FormDateContainer {...props} />
                    )
            }
            return mountedFormDateContainer
        }

        beforeEach(() => {
            props = {
                formParams: {
                    id: 0,
                    date: '20131021'
                }
            }
            mountedFormDateContainer = undefined
        })

    // All tests will go here

    it("always renders a div", () => {
        const divs = formDateContainer().find("div");
        expect(divs.length).toBeGreaterThan(0);
    })

    it("always renders a `FormDate`", () => {
        expect(formDateContainer().find(FormDate).length).toBe(1)
    })

    describe("when `showNativeDate` is true", () => {
        beforeEach(() => {
            props.showNativeDate = jest.fn()
        })

        it("[Native: True === Native is shown AND 'non-native' is not required]", () => {

            const datePicker = formDateContainer().find(FormDate),
                  isNativeProp = datePicker.props().showNativeDate,
                  isNativeDOM = !datePicker.find(".nativeDatePicker").get(0).style.display.includes('none'),
                  isNonRequired = datePicker.find(".fallbackDatePicker").find("#field-inputYear-0").get(0).hasAttribute('required')

            expect(isNativeProp).toEqual(isNativeDOM)       // Native: True === Native is not display:none (it is shown)
            expect(isNativeProp).not.toEqual(isNonRequired) // Native !== non-native is required
        })

        it("['Native' && field-date-0 === YYYYMMDD]", () => {
            const datePicker = formDateContainer().find(FormDate),
                  isNativeProp = datePicker.props().showNativeDate,
                  getValue = datePicker.find(".nativeDatePicker").find("#field-date-0").get(0).value,
                  getProp1 = datePicker.props().date,               // yyyymmdd
                  getProp2 = datePicker.props().fullDateYearLeft    // yyyy-mm-dd (value used in FormDate)

            if (isNativeProp) {
                expect(getValue).toBe(getProp2)
            }
        })
    })

    describe("when `showNativeDate` is false", () => {
        beforeEach(() => {
            props.showNativeDate = jest.fn()
        })

        it("[Non-native: True === Fallback is shown]", () => {

            const datePicker = formDateContainer().find(FormDate),
                  isNativeProp = datePicker.props().showNativeDate,
                  isNativeDOM = !datePicker.find(".nativeDatePicker").get(0).style.display.includes('none'),
                  isNonRequired = datePicker.find(".fallbackDatePicker").find("#field-inputYear-0").get(0).hasAttribute('required'),
                  isNonNative = !datePicker.find(".fallbackDatePicker").get(0).style.display.includes('none')

            if (isNonNative) {
                expect(!isNativeProp).toEqual(isNonNative)      // Non-native: True === Fallback div is not display:none (it is shown)
            }

// wrapper.find('input').simulate('keyPress', {key: 'Enter'})
// input.simulate('change', { target: { value: 'Hello' } })
// input.simulate('blur');
        })

        it("[Not 'native' === 'non-native' is required]", () => {

            const datePicker = formDateContainer().find(FormDate),
                  isNativeProp = datePicker.props().showNativeDate,
                  isNativeDOM = !datePicker.find(".nativeDatePicker").get(0).style.display.includes('none'),
                  isNonRequired = datePicker.find(".fallbackDatePicker").find("#field-inputYear-0").get(0).hasAttribute('required'),
                  isNonNative = !datePicker.find(".fallbackDatePicker").get(0).style.display.includes('none')

            if (isNonNative) {
                expect(!isNativeProp).toEqual(isNonRequired)    // Not native === non-native is required
            }
        })

        it("[Not 'native' && field-inputYear-0 === YYYY]", () => {
            const datePicker = formDateContainer().find(FormDate),
                  isNativeProp = datePicker.props().showNativeDate
                  // getValue = datePicker.find(".fallbackDatePicker").find("#field-inputYear-0").get(0).value,
                  // getProp = datePicker.props().fullDateYearLeft
            // expect(!isNativeProp).toBe(true)
        })

        it("[Not 'native' && field-inputMonth-0 === MM]", () => {

        })

        it("[Not 'native' && field-inputDay-0 === DD]", () => {

        })

    })
})