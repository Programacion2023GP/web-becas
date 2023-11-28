const InputPasswordCompnent = ({ idNamne }) => {
   return (
      <>
         {/* Switch para mostrar el cambiar contraseña */}
         {checkedShowSwitchPassword && (
            <Grid xs={12} md={12} sx={{ mb: -2 }}>
               <FormControlLabel
                  control={<Switch />}
                  label="Cambiar Contraseña"
                  checked={newPasswordChecked}
                  onChange={() => setNewPasswordChecked(!newPasswordChecked)}
               />
            </Grid>
         )}
         {/* Contraseña */}
         <Grid xs={12} md={6} sx={{ mb: 2 }}>
            <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
               <InputLabel htmlFor="password">Contraseña *</InputLabel>
               <OutlinedInput
                  id="password"
                  name="password"
                  label="Contraseña *"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  placeholder="Ingrese su contraseña, minimo 6 dígitos"
                  onBlur={handleBlur}
                  onChange={(e) => {
                     handleChange(e);
                     changePassword(e.target.value);
                  }}
                  endAdornment={
                     <InputAdornment position="end">
                        <IconButton
                           aria-label="toggle password visibility"
                           onClick={handleClickShowPassword}
                           onMouseDown={handleMouseDownPassword}
                           edge="end"
                           size="large"
                        >
                           {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                     </InputAdornment>
                  }
                  inputProps={{}}
                  fullWidth
                  disabled={newPasswordChecked ? false : true} // DESHABILITAR CON UN CHECK
                  // disabled={values.id == 0 ? false : true}
                  error={errors.password && touched.password}
               />
               {touched.password && errors.password && (
                  <FormHelperText error id="ht-password">
                     {errors.password}
                  </FormHelperText>
               )}
            </FormControl>
            {strength !== 0 && (
               <FormControl fullWidth>
                  <Box sx={{ mb: 2 }}>
                     <Grid container spacing={2} alignItems="center">
                        <Grid>
                           <Box
                              style={{ backgroundColor: level?.color }}
                              sx={{
                                 width: 85,
                                 height: 8,
                                 borderRadius: "7px"
                              }}
                           />
                        </Grid>
                        <Grid>
                           <Typography variant="subtitle1" fontSize="0.75rem">
                              {level?.label}
                           </Typography>
                        </Grid>
                     </Grid>
                  </Box>
               </FormControl>
            )}
         </Grid>
      </>
   );
};
