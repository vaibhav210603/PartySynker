import React, { useState } from 'react'
import './admin.css'

export default function Admin() {
    const [flag,setFlag]=useState(false)
  return (
    <div>

        <div ontouchstart="">
            <div class="control">
                 <a onClick={()=>setFlag(flag==true?false:true)} href="#">CONTROLS</a>
            </div>
        </div>

    {flag && <div className='dialogbox'>
        
        <div className='musicSelector'>
            <label for="dog-names">Choose a song:</label>
                <select  className='dropdown' name="song-names" id="song-names">    
                    <option value="smack_that">Smack that</option>
                    <option value="gods_plan">Gods Plan</option>
                    <option value="khuda_jaane">Khuda Jaane</option>
                    <option value="Hawa_Hawa">Hawa Hawa</option>
                </select>

                
        </div>
        <button className='select'>play</button>

        </div>}
      
    </div>
  )
}
