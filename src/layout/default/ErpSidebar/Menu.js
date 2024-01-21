import ErpMenuList from './ErpMenuList';
import classNames from 'classnames'

function MenuList({className, ...props }) {
    const compClass = classNames({
        'nk-menu': true,
        [className]: className
    });
    return (
        <ul className={compClass}>
            {props.children}
        </ul>
    )
}

function Menu() {
  return (
    <MenuList>
        <ErpMenuList />
    </MenuList>
  )
}

export default Menu